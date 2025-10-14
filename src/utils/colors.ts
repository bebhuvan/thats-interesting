/**
 * Color system mapping categories and wonder scores to accent colors
 */

// Category to color mapping
const categoryColorMap: Record<string, string> = {
  // Natural Sciences - Blue tones
  'Astronomy': 'blue',
  'Astrophysics': 'blue',
  'Cosmology': 'blue',
  'Quantum Physics': 'blue',
  'Particle Physics': 'blue',
  'Physics': 'blue',
  'Marine Biology': 'blue',
  'Oceanography': 'blue',

  // Life Sciences - Green tones
  'Biology': 'green',
  'Neuroscience': 'green',
  'Genetics': 'green',
  'Biochemistry': 'green',
  'Microbiology': 'green',
  'Mycology': 'green',
  'Entomology': 'green',
  'Ornithology': 'green',

  // Chemistry & Materials - Purple tones
  'Chemistry': 'purple',
  'Materials Science': 'purple',
  'Nanotechnology': 'purple',

  // Mathematics & Computing - Cyan tones
  'Mathematics': 'cyan',
  'Computer Science': 'cyan',
  'Cryptography': 'cyan',
  'Artificial Intelligence': 'cyan',
  'Quantum Computing': 'cyan',

  // Social Sciences - Orange tones
  'Psychology': 'orange',
  'Sociology': 'orange',
  'Anthropology': 'orange',
  'Economics': 'orange',

  // History & Humanities - Yellow tones
  'History': 'yellow',
  'Ancient History': 'yellow',
  'Medieval History': 'yellow',
  'Economic History': 'yellow',
  'History of Technology': 'yellow',
  'Archaeology': 'yellow',
  'Philosophy': 'yellow',
  'Linguistics': 'yellow',
  'Art History': 'yellow',

  // Applied Sciences - Red/Accent tones
  'Engineering': 'red',
  'Medicine': 'red',
  'Environmental Science': 'red'
};

// Wonder score to intensity mapping
export function getWonderScoreColor(score: number): string {
  if (score >= 9) return 'var(--accent-dark)'; // Deep red for exceptional
  if (score >= 8) return 'var(--accent)';      // Orange for great
  if (score >= 7) return 'var(--yellow)';       // Yellow for good
  if (score >= 6) return 'var(--blue)';         // Blue for decent
  return 'var(--grey-light)';                    // Grey for low scores
}

// Get color for a category
export function getCategoryColor(category: string): string {
  const colorName = categoryColorMap[category] || 'accent'; // Default to accent

  const colorMap: Record<string, string> = {
    'blue': 'var(--blue)',
    'green': '#2a9d8f',
    'purple': '#9b5de5',
    'cyan': '#00b4d8',
    'orange': 'var(--accent)',
    'yellow': 'var(--yellow)',
    'red': '#e63946'
  };

  return colorMap[colorName] || 'var(--accent)';
}

// Get CSS class for category-based styling
export function getCategoryClass(category: string): string {
  const colorName = categoryColorMap[category] || 'accent';
  return `category-${colorName}`;
}

// Get opacity for wonder score (higher score = higher opacity)
export function getWonderScoreOpacity(score: number): number {
  return Math.max(0.3, Math.min(1.0, score / 10));
}
