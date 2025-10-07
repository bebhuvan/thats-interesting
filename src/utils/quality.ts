import type { Fact, QualityScore } from '../types/fact';

export class QualityScorer {
  static scoreFact(fact: Fact): QualityScore {
    const wonderScore = fact.wonderScore || 5;
    const verifiability = this.scoreVerifiability(fact);
    const specificity = this.scoreSpecificity(fact);
    const accessibility = this.scoreAccessibility(fact);

    const total = (wonderScore + verifiability + specificity + accessibility) / 4;

    return {
      wonderScore,
      verifiability,
      specificity,
      accessibility,
      total
    };
  }

  private static scoreVerifiability(fact: Fact): number {
    let score = 5;

    // Has source
    if (fact.source) score += 3;
    if (fact.sourceUrl) score += 2;

    // Contains specific numbers/dates (indicator of verifiability)
    const hasNumbers = /\d+/.test(fact.content);
    if (hasNumbers) score += 1;

    return Math.min(10, score);
  }

  private static scoreSpecificity(fact: Fact): number {
    let score = 0;

    // Check for specific numbers
    const numberCount = (fact.content.match(/\d+/g) || []).length;
    score += Math.min(3, numberCount);

    // Check for comparisons (as, than, like, versus)
    const hasComparison = /(as|than|like|versus|compared to)/i.test(fact.content);
    if (hasComparison) score += 2;

    // Check for scale indicators
    if (fact.scale) score += 2;

    // Check content length (not too short, not too long)
    const wordCount = fact.content.split(' ').length;
    if (wordCount >= 40 && wordCount <= 100) score += 3;

    return Math.min(10, score);
  }

  private static scoreAccessibility(fact: Fact): number {
    let score = 8; // Start high, deduct for complexity

    // Check for jargon (simplified check)
    const jargonTerms = /(quantum|molecular|synthesize|paradigm|hypothesis)/i;
    const jargonCount = (fact.content.match(jargonTerms) || []).length;
    score -= Math.min(3, jargonCount);

    // Sentence count (2-3 is ideal)
    const sentenceCount = fact.content.split(/[.!?]+/).filter(s => s.trim().length > 10).length;
    if (sentenceCount >= 2 && sentenceCount <= 4) {
      score += 2;
    }

    return Math.max(1, Math.min(10, score));
  }

  static validateFact(fact: any): boolean {
    return (
      fact &&
      typeof fact.title === 'string' &&
      typeof fact.content === 'string' &&
      fact.title.length >= 10 &&
      fact.title.length <= 100 &&
      fact.content.length >= 50 &&
      fact.content.length <= 500 &&
      fact.category &&
      fact.id
    );
  }

  static filterHighQuality(facts: Fact[], threshold = 6): Fact[] {
    return facts
      .map(fact => ({
        ...fact,
        qualityScore: this.scoreFact(fact)
      }))
      .filter(fact => fact.qualityScore.total >= threshold)
      .sort((a, b) => b.qualityScore.total - a.qualityScore.total);
  }
}
