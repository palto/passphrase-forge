# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run prettier` - Format code with Prettier
- `npm run prettier:check` - Check code formatting without modifying files
- `npm run check` - Run all checks (typecheck, lint, prettier:check)
- `npm run vercel:env` - Pull environment variables from Vercel

**Important:** Always run `npm run check` after making code changes to ensure TypeScript types are correct, ESLint rules pass, and code formatting is consistent.

## Architecture Overview

This is a Next.js 14 app that generates secure passphrases with both traditional and AI-enhanced modes. The application uses the App Router and is internationalized with next-intl.

### Core Components

**Passphrase Generation System:**

- `app/passphrase/password-generator.ts` - Core passphrase generation logic with configurable settings (word count, separators, number inclusion, umlaut stripping)
- `app/passphrase/passphrase-component.tsx` - Main UI component handling user interactions and state
- Uses SWR to fetch and cache wordlists from external URL

**AI Enhancement:**

- `app/passphrase/ai/actions.ts` - Server actions for AI-powered passphrase enhancement using OpenAI's gpt-4o
- AI creates grammatically correct Finnish sentences from word components
- Structured output validation with Zod schemas

**Internationalization:**

- `i18n.ts` - Configuration for Finnish and English support
- `messages/` - Translation files for both languages
- Browser language detection with cookie override support

**UI Framework:**

- Flowbite React components with Tailwind CSS
- Dark mode support with theme persistence
- Responsive design optimized for mobile

### Key Features

- Client-side wordlist caching for offline generation
- LocalStorage persistence for user settings
- Copy-to-clipboard functionality
- Analytics integration with Vercel Analytics
- Deployment automated via Vercel GitHub integration

### Development Notes

- TypeScript with strict mode enabled
- Path aliases configured (`@/*` maps to root)
- ESLint with Next.js and Prettier configurations
- Environment variables managed through Vercel

### Git Commit Guidelines

- Do not add co-authors in commit messages
- Do not use emojis in commit messages
- Keep commit messages clear and descriptive
