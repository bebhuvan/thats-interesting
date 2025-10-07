export interface RelatedLink {
  title: string;
  url: string;
  description?: string;
}

export interface Fact {
  id: string;
  title: string;
  summary?: string;  // Short teaser for cards (40-60 words)
  content: string;   // Full article (500-600 words)
  category: string;
  subcategory?: string;
  timeframe?: string;
  scale?: 'quantum' | 'molecular' | 'human' | 'planetary' | 'cosmic';
  wonderScore: number;
  source?: string;
  sourceUrl?: string;
  deepDive?: string;  // Legacy field - now content is the full article
  relatedTopics?: string[];
  relatedLinks?: RelatedLink[];
  generated: string;
}

export interface FactGenerationConfig {
  category?: string;
  count?: number;
  difficulty?: 'accessible' | 'intermediate' | 'advanced';
  style?: 'wonder' | 'scientific' | 'narrative';
}

export interface QualityScore {
  wonderScore: number;
  verifiability: number;
  specificity: number;
  accessibility: number;
  total: number;
}
