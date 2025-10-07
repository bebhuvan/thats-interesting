# Wonder Stream

A sophisticated fact discovery platform powered by Cloudflare Workers AI.

## ✨ Features

### Core Experience
- **Two viewing modes**: Reading (elegant grid) & Explore (organic scatter)
- **AI-powered fact generation** with quality scoring
- **Progressive disclosure**: "Learn more" expandable sections
- **Source attribution**: Every fact cites its source
- **Smart search**: Filter by title, content, or category
- **Wonder scoring**: 1-10 rating based on multiple quality factors

### Quality Enhancements
- **Multi-factor quality scoring**: Verifiability, specificity, accessibility
- **Enhanced AI prompts**: Structured generation for consistency
- **Fact validation**: Filters out low-quality or incomplete facts
- **Source tracking**: Built-in attribution system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Cloudflare Setup

1. **Install Wrangler**:
```bash
npm install -g wrangler
wrangler login
```

2. **Create KV Namespace**:
```bash
wrangler kv:namespace create WONDER_STREAM_KV
```

3. **Update wrangler.toml** with your KV namespace ID

4. **Deploy**:
```bash
npm run build
wrangler pages deploy dist
```

## 📁 Project Structure

```
wonder-stream/
├── src/
│   ├── components/
│   │   └── FactCard.astro      # Fact card with progressive disclosure
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML structure
│   ├── pages/
│   │   ├── index.astro         # Main page
│   │   └── api/
│   │       └── generate.ts     # AI fact generation endpoint
│   ├── types/
│   │   └── fact.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── prompts.ts          # AI prompt engineering
│   │   └── quality.ts          # Quality scoring system
│   └── styles/
│       └── global.css          # Global styles
├── astro.config.mjs            # Astro configuration
└── wrangler.toml               # Cloudflare Workers config
```

## 🎨 Design Philosophy

### Typography
- **Playfair Display**: Elegant serif for headings
- **Crimson Text**: Readable serif for body content
- **JetBrains Mono**: Technical accents and metadata

### Color System
- **Accent**: Warm orange (#e07820) for highlights
- **Surface**: Clean whites and off-whites
- **Text**: Graduated grays for hierarchy

### Layout Modes

**Reading Mode**:
- Asymmetric 12-column grid
- Magazine-inspired layouts
- Facts sized by importance
- Optimized for sequential reading

**Explore Mode**:
- Organic scatter positioning
- Category-based clustering
- Gentle rotation for dynamism
- Encourages serendipitous discovery

## 🤖 AI Integration

### Prompt Engineering
- Structured JSON output
- Multi-factor quality requirements
- Style variation (wonder, scientific, narrative)
- Difficulty levels (accessible, intermediate, advanced)

### Quality Scoring
Automated scoring across 4 dimensions:
1. **Wonder Score** (1-10): Subjective amazingness
2. **Verifiability**: Has sources and specific details
3. **Specificity**: Concrete numbers and comparisons
4. **Accessibility**: Easy to understand

Facts must score ≥6/10 average to appear.

### Source Attribution
Every fact includes:
- Source description
- Optional deep-dive section
- Related topics
- Generation timestamp

## 📊 Features Implemented

✅ Clean, focused architecture
✅ Enhanced AI prompts with quality scoring
✅ Progressive disclosure (Learn more sections)
✅ Source attribution system
✅ Two viewing modes (Reading/Explore)
✅ Search functionality
✅ Responsive design
✅ Loading states
✅ TypeScript throughout

## 🔧 Configuration

### Environment Variables
Create `.dev.vars` for local development:

```bash
# Not needed locally - uses platform proxy
# In production, bindings are automatic
```

### Wrangler Configuration
- AI binding for Llama 3
- KV namespace for caching (future)
- Production environment setup

## 🎯 Next Steps (Optional)

- Add fact caching with KV
- Implement semantic similarity detection
- Add drag-and-drop in explore mode
- Create fact collections
- Add URL routing for individual facts
- Implement analytics

## 📝 Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `wrangler pages deploy dist` | Deploy to Cloudflare Pages |

## 📝 License

MIT

---

Built with ❤️ using Astro and Cloudflare Workers AI
