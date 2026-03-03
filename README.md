# Passphrase Forge (Salasanaseppa)

A secure and memorable passphrase generator that uses words from the official Kotus Finnish wordlist as seed material, then transforms them with AI into easy-to-remember, grammatically correct sentences.

🔗 **Live Demo**: [salasanaseppa.com](https://salasanaseppa.com)

## Features

- 🇫🇮 **Kotus Wordlist Foundation**: Uses official Finnish language words from Kotus (Institute for the Languages of Finland) as seed material
- 🤖 **AI-Generated Memorability**: Transforms seed words into grammatically correct, easy-to-remember Finnish sentences using OpenAI GPT-4o
- 🌍 **Internationalization**: Supports Finnish and English languages
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 📋 **Copy to Clipboard**: One-click copying of generated passphrases
- 📊 **Analytics**: Usage tracking with PostHog

## Getting Started

### Prerequisites

- Node.js 24+
- npm
- Vercel CLI ([installation instructions](https://vercel.com/docs/cli))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Link to the Vercel project:

```bash
vercel link
```

3. Set up environment variables):

```bash
npm run vercel:env
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run prettier` - Format code with Prettier
- `npm run check` - Run all checks (typecheck, lint, prettier, tests)
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:ai` - Run AI quality tests (requires OpenAI API key)
- `npm run vercel:env` - Pull environment variables from Vercel

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Flowbite React
- **AI**: OpenAI GPT-4o
- **Internationalization**: next-intl
- **Data Fetching**: SWR
- **Deployment**: Vercel

## Architecture

The application consists of:

- **Core Generator** (`app/passphrase/password-generator.ts`): Configurable passphrase generation logic
- **AI Enhancement** (`app/passphrase/ai/actions.ts`): Server actions for AI-powered sentence creation
- **UI Components** (`app/passphrase/passphrase-component.tsx`): Main user interface
- **Internationalization**: Finnish and English support with automatic language detection

## Deployment

The project is automatically deployed to [salasanaseppa.com](https://salasanaseppa.com) using Vercel's GitHub integration from the main branch.

## License

This project is private and proprietary.
