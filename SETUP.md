# Wonder Stream - Daily Fact Generation Setup

This guide will help you set up automatic daily fact generation for Wonder Stream.

## How It Works

- **2 new facts** are generated automatically every day at 00:00 UTC
- Facts are stored in `src/data/facts.json`
- GitHub Actions commits new facts to the repository
- Cloudflare Workers AI (Llama 3-8B) generates high-quality facts
- The system keeps the 50 most recent facts

## Setup Instructions

### 1. Get Cloudflare Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Get your **Account ID**:
   - Click on "Workers & Pages" in the sidebar
   - Your Account ID is shown in the right sidebar
3. Create an **API Token**:
   - Go to My Profile → API Tokens
   - Click "Create Token"
   - Use the "Edit Cloudflare Workers" template
   - Or create custom with: `Account.Workers AI Read`
   - Save the token securely

### 2. Configure GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `CF_ACCOUNT_ID`: Your Cloudflare Account ID
   - `CF_API_TOKEN`: Your Cloudflare API Token

### 3. Test Locally (Optional)

Create a `.env` file:

```bash
CF_ACCOUNT_ID=your-account-id
CF_API_TOKEN=your-api-token
```

Run the generator:

```bash
npm run generate-facts
```

This will generate 2 new facts and add them to `src/data/facts.json`.

### 4. Enable GitHub Actions

The workflow is already configured in `.github/workflows/generate-daily-facts.yml`.

It will run automatically every day at midnight UTC, or you can:
- Go to Actions → "Generate Daily Facts" → "Run workflow"
- Manually trigger fact generation anytime

## File Structure

```
wonder-stream/
├── src/
│   └── data/
│       └── facts.json          # All facts stored here
├── scripts/
│   └── generate-facts.mjs      # Fact generation script
└── .github/
    └── workflows/
        └── generate-daily-facts.yml  # Daily automation
```

## How Facts Are Generated

1. **Category Selection**: Random category from 12 options (Physics, Biology, etc.)
2. **AI Generation**: Cloudflare AI generates 2 facts with:
   - Compelling title (6-8 words)
   - Fascinating content (2-3 sentences)
   - Wonder score (1-10)
   - Source attribution
   - Optional deep dive section
3. **Quality Check**: Facts are validated and cleaned
4. **Storage**: Added to `facts.json` (newest first)
5. **Trimming**: Keeps only the 50 most recent facts

## Customization

### Change Generation Time

Edit `.github/workflows/generate-daily-facts.yml`:

```yaml
schedule:
  - cron: '0 0 * * *'  # Change this cron expression
```

### Generate More/Fewer Facts

Edit `scripts/generate-facts.mjs`:

```javascript
// Line ~36: Change the prompt to request more facts
return `...Generate 5 mind-blowing facts...`  // Change from 2 to 5
```

### Add More Categories

Edit `scripts/generate-facts.mjs`:

```javascript
const CATEGORIES = [
  'Quantum Physics',
  'Marine Biology',
  // Add your categories here
  'Mycology',
  'Robotics'
];
```

## Troubleshooting

### Facts not generating?

1. Check GitHub Actions logs: Actions → "Generate Daily Facts"
2. Verify secrets are set correctly
3. Check Cloudflare AI quota (free tier: 10,000 requests/day)

### AI generating low-quality facts?

Edit the prompt in `scripts/generate-facts.mjs` to be more specific about what you want.

### Want to regenerate all facts?

Clear `src/data/facts.json` and run:
```bash
npm run generate-facts
```
Multiple times to build up your collection.

## Cost

**100% Free** using:
- Cloudflare Workers AI (10,000 requests/day free)
- GitHub Actions (2,000 minutes/month free for public repos)
- File-based storage (no database needed)

At 2 facts per day, you'll never hit the free tier limits.

## Next Steps

- Facts are now automatically generated daily
- Each deployment rebuilds the site with new facts
- Consider setting up Cloudflare Pages for automatic deploys on commit

---

Built with ❤️ for Wonder Stream
