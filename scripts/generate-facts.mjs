#!/usr/bin/env node

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACTS_FILE = path.join(__dirname, '../src/data/facts.json');

// Categories for diverse fact generation
const CATEGORIES = [
  'Quantum Physics',
  'Marine Biology',
  'Neuroscience',
  'Mathematics',
  'Ancient History',
  'Astronomy',
  'Psychology',
  'Linguistics',
  'Chemistry',
  'Geology',
  'Anthropology',
  'Computer Science'
];

// Cloudflare AI API endpoint
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  console.error('❌ Missing CF_ACCOUNT_ID or CF_API_TOKEN environment variables');
  console.log('Set them in GitHub Secrets or .env file');
  process.exit(1);
}

// Best model for long-form article generation:
// - GPT-OSS-120B: 120B params, 128K context, same cost as Llama 4 Scout, better variation
// - Much better creative variation and writing diversity
// - OpenAI architecture with better instruction following
const AI_MODEL = '@cf/openai/gpt-oss-120b';
const AI_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${AI_MODEL}`;

function selectRandomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

function generatePrompt(category) {
  return `You are a world-class science communicator writing engaging, in-depth articles. Generate 1 fascinating, scientifically accurate article about ${category}.

REQUIREMENTS:
- Article must be 500-600 words
- Verifiable and accurate information
- Include unexpected connections or scale comparisons
- Focus on facts that shift perspective
- Avoid widely known information
- Include specific numbers, examples, and comparisons
- Use storytelling techniques to engage readers
- Build from simple to complex concepts
- End with philosophical or perspective-shifting insights
- Suggest 2-3 relevant Wikipedia article titles for further reading

WRITING STYLE:
- Start with a hook that captures attention
- Use vivid, evocative language
- Break complex ideas into digestible paragraphs
- Include analogies and real-world examples
- Balance scientific precision with accessibility
- Create a narrative arc: setup → development → insight
- Write for curious 16-year-olds with good reading skills

STRUCTURE (500-600 words total):
- Opening Hook: 50-80 words - Start with something surprising
- Main Explanation: 200-250 words - Core concept with examples
- Deeper Context: 150-200 words - Historical background, implications, or mechanisms
- Connections: 100-150 words - Link to other ideas, broader significance
- Closing Insight: 50-80 words - Perspective-shifting conclusion

OUTPUT FORMAT (valid JSON only):
[
  {
    "id": "descriptive-slug",
    "title": "Compelling Article Title (6-10 words)",
    "summary": "1-2 sentence teaser that appears on cards (40-60 words)",
    "content": "Full 500-600 word article with multiple paragraphs. Use \\n\\n for paragraph breaks.",
    "category": "${category}",
    "scale": "quantum|molecular|human|planetary|cosmic",
    "wonderScore": 8,
    "source": "Brief source attribution",
    "wikiTopics": ["Exact Wikipedia Article Title 1", "Exact Wikipedia Article Title 2", "Exact Wikipedia Article Title 3"]
  }
]

IMPORTANT:
- For wikiTopics, provide EXACT Wikipedia article titles that exist (e.g., "Octopus", "Hemocyanin", "Exponential growth")
- Write the full article in the "content" field (500-600 words)
- Use "summary" for the short version shown on cards
- Use \\n\\n for paragraph breaks in the content field

Return ONLY the JSON array, no other text.`;
}

async function generateFactsWithAI(category) {
  const prompt = generatePrompt(category);

  console.log(`🤖 Generating fact for category: ${category}`);

  // GPT-OSS uses 'input' format instead of 'messages'
  const systemPrompt = "You are an expert science communicator who writes engaging, in-depth articles. Always respond with valid JSON only. Vary your writing style dramatically between facts - never repeat the same narrative structure or opening phrases.\n\n";

  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: systemPrompt + prompt,
      reasoning: {
        effort: "medium"
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // GPT-OSS returns response in output array with message type
  let content = '';

  if (data.result?.output && Array.isArray(data.result.output)) {
    // Find the message type output (GPT-OSS format)
    const messageOutput = data.result.output.find(item => item.type === 'message');
    if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
      // Content is an array of content blocks, get the text from first block
      content = messageOutput.content[0]?.text || '';
    }
  } else {
    // Fallback for other formats
    content = data.result?.response || data.result || '';
  }

  // Extract JSON from string response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('AI Response:', JSON.stringify(data, null, 2));
    throw new Error('Could not extract JSON from AI response');
  }

  const facts = JSON.parse(jsonMatch[0]);

  // Clean and validate facts
  return facts.map(fact => ({
    id: fact.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    title: fact.title.trim(),
    summary: fact.summary?.trim(),
    content: fact.content.trim(),
    category: fact.category.trim(),
    subcategory: fact.subcategory?.trim(),
    scale: fact.scale,
    wonderScore: Math.min(10, Math.max(1, fact.wonderScore || 5)),
    source: fact.source?.trim(),
    relatedLinks: fact.wikiTopics ? fact.wikiTopics.map(topic => ({
      title: topic,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`
    })) : [],
    generated: new Date().toISOString()
  }));
}

async function main() {
  try {
    console.log('✨ Wonder Stream - Daily Fact Generator\n');

    // Read existing facts
    const factsData = JSON.parse(fs.readFileSync(FACTS_FILE, 'utf-8'));
    const existingFacts = factsData.facts || [];

    console.log(`📚 Current facts: ${existingFacts.length}`);

    // Select TWO different random categories for diversity
    const category1 = selectRandomCategory();
    let category2 = selectRandomCategory();
    // Ensure we don't pick the same category twice
    while (category2 === category1) {
      category2 = selectRandomCategory();
    }

    // Generate 1 fact from each category for maximum diversity
    console.log(`🎯 Generating facts from: ${category1} and ${category2}`);
    const facts1 = await generateFactsWithAI(category1);
    const facts2 = await generateFactsWithAI(category2);

    // Take 1 fact from each (in case AI generates 2 per category)
    const newFacts = [facts1[0], facts2[0]];
    console.log(`✅ Generated ${newFacts.length} new facts`);

    // Add to facts list (prepend so newest are first)
    const updatedFacts = [...newFacts, ...existingFacts];

    // Keep only the most recent 50 facts
    const trimmedFacts = updatedFacts.slice(0, 50);

    // Update facts file
    const updatedData = {
      facts: trimmedFacts,
      meta: {
        lastGenerated: new Date().toISOString(),
        totalFacts: trimmedFacts.length
      }
    };

    fs.writeFileSync(FACTS_FILE, JSON.stringify(updatedData, null, 2));

    console.log(`\n💾 Saved to ${FACTS_FILE}`);
    console.log(`📊 Total facts: ${trimmedFacts.length}`);
    console.log('\n🎉 Success!');

    // Output new facts for review
    console.log('\n📝 New facts:');
    newFacts.forEach((fact, i) => {
      console.log(`\n${i + 1}. ${fact.title}`);
      console.log(`   Category: ${fact.category}`);
      console.log(`   Wonder Score: ${fact.wonderScore}/10`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
