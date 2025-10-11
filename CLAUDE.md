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
- `npm run check` - Run all checks (typecheck, lint, prettier:check, test)
- `npm run vercel:env` - Pull environment variables from Vercel

**Testing Commands:**

- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:ai` - Run AI quality tests (costs pennies)

**Important:** Always run `npm run check` after making code changes to ensure TypeScript types are correct, ESLint rules pass, code formatting is consistent, and all tests pass.

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

- Node.js 22+ required (Flowbite React CLI compatibility issue with Node 20)
- TypeScript with strict mode enabled
- Path aliases configured (`@/*` maps to root)
- ESLint with Next.js and Prettier configurations
- Environment variables managed through Vercel

### Git Commit Guidelines

> **IMPORTANT:** Only create commits when the developer explicitly requests it. The developer is in charge and needs to validate changes before they are committed. Do not commit proactively.

When creating commits:
- Do not add co-authors in commit messages
- Do not use emojis in commit messages
- Keep commit messages clear and descriptive

### Testing Implementation Guidelines

When implementing any kind of tests, follow this systematic approach:

1. **Create a todo list first** using the TodoWrite tool with specific, testable tasks
2. **Implement tests one by one** - never create multiple tests at once
3. **Verify each test works** before moving to the next one
4. **Mark todos as completed** only after the test passes successfully
5. **Only move to the next test** after the current one is verified working

**Example process:**

```
TodoWrite: Create todo list with test cases
- Test A: Verify basic functionality
- Test B: Verify edge cases
- Test C: Verify error handling

Implement Test A → Run test → Verify it passes → Mark todo complete
Implement Test B → Run test → Verify it passes → Mark todo complete
Implement Test C → Run test → Verify it passes → Mark todo complete
```

This prevents creating large numbers of faulty tests that require extensive debugging later.

### Implementation Scope Guidelines

When implementing any feature:

1. **Implement only the bare minimum** requested - no additional "helpful" features
2. **Ask before adding optional features** - especially ones with ongoing costs or side effects
3. **Avoid automatic pattern replication** - don't add features just because similar ones exist
4. **Consider cost/safety implications** - be extra cautious with anything that could run continuously or incur costs
5. **Leave optional enhancements for later steps** - focus on core functionality first

**Example of what NOT to do:**

- User asks for "AI testing" → You add AI testing + watch mode + multiple budget tiers + convenience scripts
- **Correct approach:** Add basic AI testing, then ask "Would you like me to add watch mode or other convenience features?"

## Testing Framework Architecture

This project uses **Vitest** as the primary testing framework with the following structure:

### Test Framework Stack

- **Vitest**: Modern, fast testing framework with native TypeScript support
- **@testing-library**: DOM testing utilities for UI components
- **jsdom**: Browser environment simulation for component tests
- **dotenv**: Environment variable loading for test configuration

### Test Configuration

- **vitest.config.mts**: Main Vitest configuration with React plugin and path resolution
- **vitest.setup.ts**: Test setup file that loads environment variables from `.env.development.local`
- **Environment loading**: Automatically loads `OPENAI_API_KEY` and other env vars for seamless testing

### Test Types and Structure

**Unit Tests** (`__tests__/*.test.ts`):

- Standard unit tests using Vitest
- Located alongside the code they test
- Example: `app/passphrase/__tests__/password-generator.test.ts`

**AI Quality Tests** (`__tests__/ai-quality/`):

- Simple testing framework for AI-generated passphrase quality
- **Environment-gated**: Automatically enabled when API key is present
- **Single test approach**: Tests one input with 5 parallel generations
- **Clear pass/fail**: Simple PASS/FAIL for digit preservation, capitalization, length

### AI Testing Framework Components

```
app/passphrase/__tests__/ai-quality/
├── ai-enhancement.test.ts    # Single test with 5 parallel AI generations
├── config.ts                 # Environment validation
└── README.md                # Simple usage documentation
```

### Running Tests

- **Unit tests**: Always run, no external dependencies
- **AI tests**: Run with `npm run test:ai` when API key is configured
- **Environment setup**: Loads `OPENAI_API_KEY` from `.env.development.local`

### Key Features

- **Simple output**: One-line format showing all quality metrics at a glance
- **Complete visibility**: Shows all 5 results even when tests fail early using vitest soft assertions
- **Pattern detection**: Easy to spot issues like "3/5 convert digits to words"
- **Reliable AI generation**: Built-in retry logic handles API failures automatically
- **Descriptive errors**: Clear error messages when quality requirements aren't met
