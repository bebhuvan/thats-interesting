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

    // Create cache key from config
    const cacheKey = `facts:${JSON.stringify(config)}`;

    // Try to get from KV cache first
    const KV = locals.runtime.env.WONDER_STREAM_KV;
    if (KV) {
      try {
        const cached = await KV.get(cacheKey, 'json');
        if (cached) {
          return new Response(JSON.stringify({
            success: true,
            facts: cached.facts,
            meta: {
              ...cached.meta,
              cached: true,
              cacheHit: new Date().toISOString()
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=300',
              'X-Cache': 'HIT'
            }
          });
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
        // Continue to generation if cache fails
      }
    }

    // Generate facts using Cloudflare Workers AI
    const facts = await generateFactsWithAI(locals.runtime.env.AI, config);

    // Filter for high quality
    const highQualityFacts = QualityScorer.filterHighQuality(facts, 6);

    const response = {
      facts: highQualityFacts,
      meta: {
        generated: new Date().toISOString(),
        config,
        totalGenerated: facts.length,
        qualityFiltered: highQualityFacts.length
      }
    };

    // Cache the response in KV (expires in 24 hours)
    if (KV && highQualityFacts.length > 0) {
      try {
        await KV.put(cacheKey, JSON.stringify(response), {
          expirationTtl: 86400 // 24 hours
        });
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
        // Continue even if caching fails
      }
    }

    return new Response(JSON.stringify({
      success: true,
      ...response,
      meta: {
        ...response.meta,
        cached: false
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'MISS'
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

  // Use Cloudflare Workers AI binding with GPT-OSS-120B (much larger model for better variation)
  // GPT-OSS uses 'input' format instead of 'messages'
  const systemPrompt = "You are an expert science communicator who creates fascinating, accurate facts. Always respond with valid JSON only. Vary your writing style dramatically between facts - never repeat the same narrative structure or opening phrases.\n\n";
  const response = await ai.run('@cf/openai/gpt-oss-120b', {
    input: systemPrompt + prompt,
    reasoning: {
      effort: "medium"
    }
  });

  // Parse AI response
  let facts: Fact[];
  try {
    // GPT-OSS returns response in output array with message type
    let content = '';

    if (response.output && Array.isArray(response.output)) {
      // Find the message type output (GPT-OSS format)
      const messageOutput = response.output.find((item: any) => item.type === 'message');
      if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
        // Content is an array of content blocks, get the text from first block
        content = messageOutput.content[0]?.text || '';
      }
    } else {
      // Fallback for Llama format
      content = response.response || response.choices?.[0]?.message?.content || '';
    }

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
    // Default to 5 (neutral) instead of 7 to avoid score inflation
    wonderScore: Math.min(10, Math.max(1, fact.wonderScore || 5)),
    source: fact.source?.trim(),
    sourceUrl: fact.sourceUrl?.trim(),
    deepDive: fact.deepDive?.trim(),
    relatedTopics: fact.relatedTopics || [],
    relatedLinks: fact.relatedLinks || [],
    generated: new Date().toISOString()
  };
}
