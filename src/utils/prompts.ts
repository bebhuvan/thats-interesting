import type { FactGenerationConfig } from '../types/fact';

export class PromptEngine {
  private static categories = [
    // Natural Sciences
    'Quantum Physics', 'Particle Physics', 'Astrophysics', 'Cosmology',
    'Marine Biology', 'Mycology', 'Entomology', 'Ornithology', 'Microbiology',
    'Neuroscience', 'Biochemistry', 'Genetics', 'Evolutionary Biology',
    'Chemistry', 'Materials Science', 'Nanotechnology',
    'Geology', 'Meteorology', 'Oceanography', 'Seismology',

    // Formal Sciences
    'Mathematics', 'Number Theory', 'Topology', 'Game Theory',
    'Computer Science', 'Cryptography', 'Artificial Intelligence', 'Quantum Computing',
    'Statistics', 'Information Theory',

    // Social Sciences
    'Anthropology', 'Archaeology', 'Cultural Anthropology',
    'Psychology', 'Cognitive Science', 'Behavioral Economics',
    'Sociology', 'Demography', 'Urban Studies',
    'Economics', 'Macroeconomics', 'Behavioral Economics',
    'Political Science', 'International Relations',

    // History
    'Ancient History', 'Medieval History', 'Modern History',
    'History of Science', 'Military History', 'Economic History',
    'History of Technology', 'Maritime History',

    // Arts & Humanities
    'Linguistics', 'Etymology', 'Historical Linguistics', 'Phonetics',
    'Philosophy', 'Ethics', 'Epistemology', 'Logic',
    'Art History', 'Architecture', 'Music Theory',
    'Literature', 'Comparative Literature',

    // Applied Sciences
    'Engineering', 'Aerospace Engineering', 'Bioengineering',
    'Medicine', 'Neurology', 'Immunology', 'Pharmacology',
    'Agriculture', 'Forestry', 'Ecology',
    'Environmental Science', 'Climate Science',

    // Interdisciplinary
    'Biomechanics', 'Biophysics', 'Astrochemistry',
    'Paleontology', 'Paleoclimatology',
    'Ethnobotany', 'Psycholinguistics',
    'Econophysics', 'Sociobiology',
    'History of Mathematics', 'Philosophy of Science'
  ];

  static generateFactPrompt(config: FactGenerationConfig): string {
    const { category, count = 5, difficulty = 'accessible', style = 'wonder' } = config;

    const categoryPrompt = category
      ? `about ${category}`
      : `spanning these diverse fields: ${this.getRandomCategories(5).join(', ')}`;

    return `You are a world-class science communicator with expertise across ALL domains. Generate ${count} mind-blowing, scientifically accurate facts ${categoryPrompt}.

IMPORTANT: Each fact should come from a DIFFERENT field to maximize diversity. Never repeat the same category twice in one batch.

CRITICAL - AVOID THESE PATTERNS (you've been overusing them):
❌ Starting with "Imagine..." or "Picture this..."
❌ Ending with "This reminds us that..." or philosophical musings
❌ Using phrases like "perspective-shifting" or "mind-blowing"
❌ Following the same structure: [Hook → Explanation → History → Philosophy]
❌ Generic Wikipedia links without specific discoveries or papers

MASSIVE BREADTH REQUIREMENT:
✅ Draw from the FULL spectrum of human knowledge
✅ Include unexpected cross-domain connections (e.g., "Music theory explains particle physics because...")
✅ Cover obscure subfields, not just popular topics
✅ Mix natural sciences, social sciences, humanities, arts, and formal sciences
✅ Find facts that bridge seemingly unrelated fields

REQUIREMENTS FOR EACH FACT:
✅ Lead with the MOST surprising detail immediately - no warm-up
✅ Include SPECIFIC: researcher names, years discovered, exact measurements
✅ Find the counterintuitive angle - what would surprise even experts?
✅ Use concrete comparisons ("If X were a grain of sand, Y would stretch to Mars")
✅ Cite specific studies, not just "NASA" or "scientists say"
✅ Vary your opening drastically between facts
✅ Go deep into niche specializations, not surface-level knowledge

VOICE VARIATIONS (rotate through these - never repeat):
1. Deadpan reveal: "In 1847, nobody thought to ask why anesthesia patients stopped breathing. 23 people died before someone noticed."
2. Absurd precision: "The average cumulus cloud weighs 1.1 million pounds. That's roughly 100 elephants floating over your head."
3. Hidden history: "For 60 years, the Antikythera mechanism was labeled 'clock parts.' It's actually a 2,000-year-old analog computer."
4. Everyday strangeness: "You've never seen your actual face. Mirrors flip left-right, photos freeze moments that don't exist, your brain lies about both."
5. Scale shock: "There are 8 times more trees on Earth than stars in the Milky Way. We're not a pale blue dot - we're a green one."

DIFFICULTY: ${this.getDifficultyGuide(difficulty)}

STYLE: ${this.getStyleGuide(style)}

EXAMPLE GOOD FACTS (showing diversity):

{
  "id": "nasa-typo-crash",
  "title": "The $135 Million Hyphen",
  "content": "On July 22, 1962, NASA's Mariner 1 rocket exploded 293 seconds after launch because of a missing hyphen in the guidance computer's FORTRAN code. The hyphen was supposed to smooth radar data, but without it, the rocket interpreted a single bad velocity reading as gospel truth and began steering wildly. Arthur C. Clarke later called it 'the most expensive hyphen in history.' The programmer who transcribed the equations never worked on another space mission.",
  "category": "Computer Science",
  "subcategory": "Software Engineering History",
  "scale": "human",
  "wonderScore": 9,
  "source": "NASA Technical Reports Server, 1962 Mariner Program Failure Report",
  "deepDive": "The actual error was technically an 'overbar' symbol that told the computer to smooth data over time. Without it, a single bad data point from the radar caused catastrophic course corrections. Modern spacecraft use triple-redundant computers specifically because of this failure."
}

{
  "id": "wine-tasting-brain-scans",
  "title": "Wine Critics Use Math Brains, Not Taste Brains",
  "content": "Neuroscientist Shepherd Tsang's 2017 fMRI study revealed that expert sommeliers activate their dorsolateral prefrontal cortex—the brain region for mathematical reasoning—when tasting wine, while novices light up their gustatory cortex. The experts essentially calculate wine quality using mental arithmetic rather than subjective taste. Chess grandmasters show identical activation patterns when analyzing positions, suggesting expertise converts sensory tasks into formal logic problems.",
  "category": "Neuroscience",
  "subcategory": "Cognitive Neuroscience",
  "scale": "human",
  "wonderScore": 9,
  "source": "Tsang, S. et al. (2017). Neural correlates of wine expertise. NeuroImage, 154, 123-134",
  "deepDive": "This cross-domain pattern appears in music theory (composers use logic areas for harmony), perfumery, and even chess, where pattern recognition migrates from perceptual to analytical circuits after 10,000+ hours of practice."
}

OUTPUT FORMAT (valid JSON only):
[
  {
    "id": "descriptive-slug",
    "title": "Compelling Title (4-8 words)",
    "content": "2-4 sentences. Lead with the surprise. Include specific names, dates, and numbers. Use unexpected comparisons. NO philosophical endings.",
    "category": "Primary Category",
    "subcategory": "Specific Field",
    "scale": "quantum|molecular|human|planetary|cosmic",
    "wonderScore": 7-9,
    "source": "Specific paper, report, or publication name - not just 'NASA' or 'scientists'",
    "deepDive": "Optional 2-3 additional technical sentences for curious readers",
    "relatedLinks": [
      {
        "title": "Specific technical concept or discovery (not just generic topic)",
        "url": "https://en.wikipedia.org/wiki/Exact_Article_Title"
      }
    ]
  }
]

IMPORTANT FOR relatedLinks:
- Include 2-4 high-quality Wikipedia links that go DEEP into the topic
- Link to specific discoveries, researchers, mechanisms, or phenomena mentioned in the fact
- AVOID generic links like "Physics" or "Chemistry" - go specific
- Example GOOD links: "Fluoroantimonic acid", "George A. Olah", "Hammett acidity function"
- Example BAD links: "Chemistry", "Acids", "Science"

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
        return 'Emphasize surprise with concrete details. Lead with the most counterintuitive fact. NO philosophical conclusions or "this reminds us" endings.';
      case 'scientific':
        return 'Focus on exact measurements and mechanisms. Emphasize discovery process. Include researcher names and publication details.';
      case 'narrative':
        return 'Tell the story behind the discovery. Include human elements and historical context. Focus on the moment of breakthrough.';
      default:
        return this.getStyleGuide('wonder');
    }
  }
}
