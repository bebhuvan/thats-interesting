import type { FactGenerationConfig } from '../types/fact';

export class PromptEngine {
  private static categories = [
    'Quantum Physics', 'Marine Biology', 'Neuroscience', 'Mathematics',
    'Ancient History', 'Astronomy', 'Psychology', 'Linguistics',
    'Chemistry', 'Geology', 'Anthropology', 'Computer Science'
  ];

  static generateFactPrompt(config: FactGenerationConfig): string {
    const { category, count = 5, difficulty = 'accessible', style = 'wonder' } = config;

    const categoryPrompt = category
      ? `about ${category}`
      : `spanning ${this.getRandomCategories(3).join(', ')}`;

    return `You are a world-class science communicator. Generate ${count} mind-blowing, scientifically accurate facts ${categoryPrompt}.

REQUIREMENTS:
- Each fact must be verifiable and accurate
- Include unexpected connections or scale comparisons
- Focus on facts that shift perspective
- Avoid widely known "did you know" facts
- Include specific numbers and comparisons

DIFFICULTY: ${this.getDifficultyGuide(difficulty)}

STYLE: ${this.getStyleGuide(style)}

OUTPUT FORMAT (valid JSON only):
[
  {
    "id": "descriptive-slug",
    "title": "Compelling Title (6-8 words)",
    "content": "2-3 sentences with specific details and a perspective-shifting insight.",
    "category": "Primary Category",
    "subcategory": "Specific Field",
    "scale": "quantum|molecular|human|planetary|cosmic",
    "wonderScore": 8,
    "source": "Brief source attribution",
    "deepDive": "Optional 2-3 additional sentences for those wanting more detail"
  }
]

Return ONLY the JSON array, no other text.`;
  }

  private static getRandomCategories(count: number): string[] {
    const shuffled = [...this.categories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private static getDifficultyGuide(difficulty: string): string {
    switch (difficulty) {
      case 'accessible':
        return 'Accessible to curious 14-year-olds. Use relatable analogies. Explain technical terms.';
      case 'intermediate':
        return 'College-level. Can use technical terminology with brief explanations.';
      case 'advanced':
        return 'Graduate-level. Precise scientific terminology. Focus on cutting-edge research.';
      default:
        return this.getDifficultyGuide('accessible');
    }
  }

  private static getStyleGuide(style: string): string {
    switch (style) {
      case 'wonder':
        return 'Emphasize surprise and beauty. Use evocative language. End with philosophical insights.';
      case 'scientific':
        return 'Focus on exact measurements and mechanisms. Emphasize discovery process.';
      case 'narrative':
        return 'Tell the story behind the discovery. Include human elements and historical context.';
      default:
        return this.getStyleGuide('wonder');
    }
  }
}
