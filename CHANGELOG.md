# Changelog

All notable changes to this project will be documented in this file.

## [2026.0.0] - 2026-02-08

### Added

- Visual feedback indicator on the copy password button to confirm successful copy

## [2025.4.0] - 2025-12-14

### Changed

- AI-powered passphrase generation is now the only generation method
- Migrated UI framework from Flowbite React to shadcn/ui for better customization and modern design
- Simplified user interface with inline settings
- Improved page load performance with React Suspense and streaming SSR
- Updated app description to emphasize Kotus wordlist as seed material for AI transformation

### Removed

- Basic (non-AI) passphrase generation mode
- Settings drawer - replaced with inline toggle for strip umlauts option

## [2025.3.0] - 2025-08-09

### Improved

- Significantly improved AI-generated passphrase quality and reliability
- Better handling of numbers in AI-enhanced passphrases
- More consistent capitalization in generated sentences
- Enhanced grammatical correctness in Finnish AI passphrases

### Changed

- Both regular and AI generation now provide 5 passphrases to choose from instead of single options

## [2025.2.0] - 2025-08-04

### Changed

- Upgraded to Tailwind CSS v4.1.11 from v3.4.17
- Updated Node.js requirement to 22.x

## [2025.1.0] - 2025-08-03

### Changed

- Upgraded to Next.js 15.4.5 from Next.js 14 for improved performance and new features
- Upgraded to React 19.1.1 from React 18 for latest React improvements
- Upgraded Flowbite React from 0.10.2 to 0.12.5 with dark mode fixes
- Upgraded next-intl to latest version with new configuration format
- Enabled Turbopack for faster development builds
- Updated to use async request APIs (headers() and cookies() now require await)
- Switched AI model from GPT-4 to GPT-4o for better passphrase generation

### Added

- Node.js 22+ requirement for Flowbite React CLI compatibility
- Comprehensive test IDs for improved testing capabilities
- CLAUDE.md file for AI assistant guidance

### Fixed

- Dark mode functionality with proper Tailwind configuration
- AI button styling with gradient background and loading states
- Button spacing issues in passphrase component
- Duplicate separator between passphrase component and app details
- ESLint warnings for performance and React hooks

## [2024.2.0] - 2024-07-12

### Added

- Passphrase Generator settings

## [2024.1.0] - 2024-07-07

### Added

- Dark Mode
- English language support
- AI augmented passphrase

### Removed

- Link to Chrome extension as that is no longer maintained

### Changed

- Generate regular passhprases in the frontend instead of the backend
- Use Next.js 14 and React for the frontend
- Use Tailwind and Flowbite for the UI design
- Use Vercel for deployment
- Use Github for version control
