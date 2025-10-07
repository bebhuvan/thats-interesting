# Wonder Stream - Features Overview

## ✨ Clickable Facts with Unique URLs

### How It Works

Every fact now has its own dedicated page at `/fact/[id]`. When users click on a fact card, they'll see:

1. **Full Fact Details**
   - Complete title and content
   - Wonder score visualization (1-10 with animated bar)
   - Category, scale, and publication date
   - Source attribution

2. **Deep Dive Section**
   - Extended explanation for those wanting more detail
   - Formatted in a highlighted box

3. **Related Wikipedia Articles** (AI-Generated!)
   - 2-3 relevant Wikipedia links per fact
   - Suggested by Cloudflare AI during fact generation
   - Opens in new tab with external link icon
   - Topics are validated to exist on Wikipedia

4. **Share Button**
   - Native share API (mobile/desktop)
   - Falls back to copy link to clipboard

### URL Structure

```
https://yoursite.com/fact/paper-moon-journey
https://yoursite.com/fact/triple-hearts-copper-blood
https://yoursite.com/fact/brain-energy-paradox
```

Clean, readable URLs based on fact IDs!

## 🤖 AI-Powered Wikipedia Links

### How AI Generates Links

When generating daily facts, the AI now:

1. **Analyzes the fact content**
2. **Identifies 2-3 relevant Wikipedia topics**
3. **Suggests exact article titles** (e.g., "Octopus", "Hemocyanin")
4. **Converts to Wikipedia URLs** automatically

The prompt specifically asks for "EXACT Wikipedia article titles" to ensure links actually work.

### Example Output

For the "Triple Hearts, Copper Blood" fact about octopuses:

```json
{
  "wikiTopics": ["Octopus", "Hemocyanin", "Cephalopod"],
  "relatedLinks": [
    {
      "title": "Octopus",
      "url": "https://en.wikipedia.org/wiki/Octopus"
    },
    {
      "title": "Hemocyanin",
      "url": "https://en.wikipedia.org/wiki/Hemocyanin"
    },
    {
      "title": "Cephalopod",
      "url": "https://en.wikipedia.org/wiki/Cephalopod"
    }
  ]
}
```

## 📊 What Gets Generated Daily

### Using Cloudflare Workers AI (Llama 3-8B-Instruct)

**Model**: `@cf/meta/llama-3-8b-instruct`
- **Context**: 8K tokens
- **Max Output**: 4096 tokens (~3000 words)
- **Speed**: ~5-10 seconds per article
- **Cost**: FREE (up to 10,000 requests/day)

### Article Structure

Each article is **500-600 words** with:

**Card Display** (~40-60 words):
- **Title**: 6-10 words, compelling
- **Summary**: 1-2 sentence teaser
- **Category**: Random from 12 options
- **Wonder Score**: 1-10 rating

**Full Article** (500-600 words):
- **Opening Hook**: 50-80 words - Surprising start
- **Main Explanation**: 200-250 words - Core concept with examples
- **Deeper Context**: 150-200 words - Background, implications, mechanisms
- **Connections**: 100-150 words - Links to broader ideas
- **Closing Insight**: 50-80 words - Perspective-shifting conclusion

**Additional Elements**:
- **Scale**: quantum → molecular → human → planetary → cosmic
- **Source**: Brief attribution
- **2-3 Wikipedia links**: AI-suggested related articles
- **Proper paragraphs**: Using `\n\n` breaks for readability

### Writing Style

- **Narrative arc**: Setup → Development → Insight
- **Storytelling**: Analogies, examples, vivid language
- **Accessibility**: Written for curious 16-year-olds
- **Scientific accuracy**: Verifiable information
- **Engagement**: Starts with hooks, ends with philosophy

### Generation Frequency

- **Daily**: 2 new articles automatically at 00:00 UTC
- **Manual**: Run `npm run generate-facts` anytime
- **Keeps**: Most recent 50 articles only
- **Length**: 500-600 words per article (not just short facts anymore!)

## 🎨 Visual Design

### Fact Detail Page

- **Clean layout**: Max-width 680px for readability
- **Breadcrumb navigation**: "← Back to stream"
- **Wonder score bar**: Gradient-filled progress indicator
- **Highlighted sections**: Deep dive in soft mint background
- **External link icons**: Clear indicators for Wikipedia links
- **Share functionality**: Native share or copy link

### Card Improvements

- **Clickable cards**: Entire card is a link to detail page
- **Hover states**: Subtle lift and shadow
- **Pastel borders**: Rotating colors (pink, lavender, mint, peach, sky, coral)
- **Smooth transitions**: 0.2s ease on all interactions

## 📁 File Structure

```
wonder-stream/
├── src/
│   ├── data/
│   │   └── facts.json              # All facts with Wikipedia links
│   ├── pages/
│   │   ├── index.astro             # Homepage (10 recent facts)
│   │   ├── archive.astro           # All facts by category
│   │   └── fact/
│   │       └── [id].astro          # Dynamic fact detail pages
│   ├── components/
│   │   ├── FactCard.astro          # Clickable fact cards
│   │   └── Header.astro            # Shared header
│   └── types/
│       └── fact.ts                 # Updated with RelatedLink type
├── scripts/
│   └── generate-facts.mjs          # Generates facts + Wiki links
└── .github/
    └── workflows/
        └── generate-daily-facts.yml # Daily automation
```

## 🚀 Try It Now

1. **Homepage**: Click any fact card
2. **Detail Page**: See full info + Wikipedia links
3. **Share**: Click share button to copy link
4. **Navigate**: Use breadcrumb to return

### Test URLs (Local)

```
http://localhost:4322/
http://localhost:4322/fact/paper-moon-journey
http://localhost:4322/fact/triple-hearts-copper-blood
http://localhost:4322/archive
```

## 🔮 Future Enhancements

Potential additions:
- **Tags/Topics**: Filter facts by themes
- **Reading Progress**: Track which facts you've read
- **Favorites**: Bookmark interesting facts
- **Random Fact**: Surprise me button
- **Fact of the Day**: Featured fact on homepage
- **Social Sharing**: Pre-filled tweets/posts
- **RSS Feed**: Subscribe to daily facts
- **Search**: Full-text search across all facts

---

**Current Stats**:
- ✅ Clickable facts with unique URLs
- ✅ AI-generated Wikipedia links (2-3 per fact)
- ✅ Beautiful detail pages
- ✅ Share functionality
- ✅ Automated daily generation
- ✅ 100% free using Cloudflare AI
