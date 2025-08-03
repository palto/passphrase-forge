# Passphrase Forge (Salasanaseppa)

A secure and memorable passphrase generator that creates unique passwords using Finnish language words, enhanced with AI to make them easier to remember and more fun.

🔗 **Live Demo**: [salasanaseppa.com](https://salasanaseppa.com)

## Features

- 🇫🇮 **Finnish Word-Based**: Generates passphrases using Finnish words for enhanced memorability
- 🤖 **AI Enhancement**: Uses OpenAI GPT-4o-mini to create grammatically correct, memorable sentences
- 🌍 **Internationalization**: Supports Finnish and English languages
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🔒 **Client-Side Generation**: Secure generation with offline wordlist caching
- 📋 **Copy to Clipboard**: One-click copying of generated passphrases
- ⚙️ **Customizable Settings**: Configure word count, separators, and other generation parameters
- 📊 **Analytics**: Usage tracking with Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 20+ 
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
- `npm run prettier` - Format code with Prettier
- `npm run vercel:env` - Pull environment variables from Vercel

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Flowbite React
- **AI**: OpenAI GPT-4o-mini
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

## Roadmap

- [ ] Content from CMS
- [ ] Wordlist in database
- [x] AI augmented passphrase settings
- [x] Analytics integration
- [x] Internationalization support
