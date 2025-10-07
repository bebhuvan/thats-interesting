import type { APIRoute } from 'astro';
import type { Fact, FactGenerationConfig } from '../../types/fact';
import { PromptEngine } from '../../utils/prompts';
import { QualityScorer } from '../../utils/quality';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: FactGenerationConfig = await request.json();
    const config = {
      category: body.category,
      count: Math.min(body.count || 5, 10),
      difficulty: body.difficulty || 'accessible',
      style: body.style || 'wonder'
    };

    // Generate facts using Cloudflare Workers AI
    const facts = await generateFactsWithAI(locals.runtime.env.AI, config);

    // Filter for high quality
    const highQualityFacts = QualityScorer.filterHighQuality(facts, 6);

    return new Response(JSON.stringify({
      success: true,
      facts: highQualityFacts,
      meta: {
        generated: new Date().toISOString(),
        config,
        totalGenerated: facts.length,
        qualityFiltered: highQualityFacts.length
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Fact generation error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate facts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function generateFactsWithAI(ai: any, config: FactGenerationConfig): Promise<Fact[]> {
  const prompt = PromptEngine.generateFactPrompt(config);

  // Use Cloudflare Workers AI binding with Llama 4 Scout
  const response = await ai.run('@cf/meta/llama-4-scout-17b-16e-instruct', {
    messages: [
      {
        role: "system",
        content: "You are an expert science communicator who creates fascinating, accurate facts. Always respond with valid JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2048,
    temperature: 0.8,
    top_p: 0.9
  });

  // Parse AI response
  let facts: Fact[];
  try {
    const content = response.response || response.choices?.[0]?.message?.content || '';

    console.log('AI Response:', content);

    // Try to extract JSON from response (in case AI adds extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;

    facts = JSON.parse(jsonString);

    if (!Array.isArray(facts)) {
      throw new Error('AI response is not an array');
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    console.error('Raw response:', response);
    throw new Error(`Invalid AI response format: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }

  // Validate and clean facts
  return facts
    .filter(QualityScorer.validateFact)
    .map(cleanFact);
}

function cleanFact(fact: any): Fact {
  return {
    id: fact.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    title: fact.title.trim(),
    content: fact.content.trim(),
    category: fact.category.trim(),
    subcategory: fact.subcategory?.trim(),
    scale: fact.scale,
    wonderScore: Math.min(10, Math.max(1, fact.wonderScore || 7)),
    source: fact.source?.trim(),
    sourceUrl: fact.sourceUrl?.trim(),
    deepDive: fact.deepDive?.trim(),
    relatedTopics: fact.relatedTopics || [],
    generated: new Date().toISOString()
  };
}
