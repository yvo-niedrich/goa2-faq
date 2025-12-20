# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A companion web app for the board game "Guards of Atlantis II" (2nd printing). The app helps novice players by providing:
- **Translations** of cards into multiple languages (game is English-only)
- **FAQ entries** clarifying confusing rules and card interactions

The app is intentionally designed NOT to provide strategy guides or information meant to be fuzzy by the game designers.

## Build System Architecture

This project uses a **two-phase build process**:

### Phase 1: Data Build (`npm run build-data`)
Processes raw hero/card/FAQ data from `build/data/` into consumable JSON files:
- Reads hero definitions from `build/data/heroes.json`
- Loads card data from `build/data/cards/*.json` (one file per hero)
- Loads FAQ entries from `build/data/faqs/*.json` (hero-specific and `common.json`)
- Generates:
  - `src/data/heroes.generated.json` - Hero metadata and card references
  - `src/data/faq.generated.json` - Card ID to FAQ ID mapping
  - `public/locales/en.json` - English translations (source language)
  - Missing translation files (`*.missing.json`) for other languages

Key scripts:
- `build/build.ts` - Main orchestrator
- `build/scripts/hero.ts` - Hero data loading
- `build/scripts/cards.ts` - Card data loading and validation
- `build/scripts/faq.ts` - FAQ indexing and card linking
- `build/scripts/translations.ts` - Translation management and verification

### Phase 2: App Build (`npm run build-app`)
Standard Vite Vue 3 build that compiles the application using the generated data files.

**IMPORTANT**: Always run `npm run build-data` before `npm run build-app` when hero/card/FAQ data changes. The full `npm run build` command runs both in sequence.

## Common Development Commands

```bash
# Development
npm run dev                # Start Vite dev server
npm run build              # Full build (data + app)
npm run build-data         # Rebuild hero/card/FAQ data only
npm run preview            # Preview production build

# Testing & Quality
npm run format             # Format code with Prettier
npm run type-check         # TypeScript type checking
```

## Core Application Architecture

### State Management (Pinia)
- `stores/app.ts` - Global app state (expansions filter, sort preferences)
- `stores/companion.ts` - Personal dashboard state (favorited hero, selected cards per color)
- `stores/faq.ts` - FAQ popup state management
- `stores/language.ts` - i18n locale management

### Routing
Three main views (see `src/router/index.ts`):
- `/hero/:hero?` - Hero selection and card overview
- `/me` - Personal dashboard (favorited hero with hand management)
- `/settings/:setting?` - App settings (QR code, propose FAQ)

### Data Layer
- `src/data/heroes.ts` - Hero data access, sorting, and filtering
- `src/data/faq.ts` - FAQ lookup by card ID
- Generated files are git-ignored and produced by the build process

### Key Components
- `HeroSelection.vue` - Grid of hero portraits with expansion filtering
- `HeroOverview.vue` - Single hero view with stats, cards, and FAQ access
- `CardColorColumns.vue` - Cards organized by color (gold, silver, R/G/B)
- `HeroCard.vue` - Individual card with FAQ indicator ([?!] icon)
- `FaqPopup.vue` - Modal displaying FAQ entries for a card
- `LanguageSwitcher.vue` - Language selection component

## Adding New Content

### Adding a New Hero
1. Create hero card data in `build/data/cards/{hero-name}.json` following the CardRaw interface (see `build/scripts/cards.ts:6-15`)
2. Add hero metadata to `build/data/heroes.json` with reference to the card file
3. Add hero icon to `public/hero/{hero-name}.png`
4. Run `npm run build-data` to regenerate data files
5. See `docs/contribute-hero.md` for detailed schema and examples

### Adding FAQ Entries
1. Add FAQ to appropriate file in `build/data/faqs/`:
   - Hero-specific: `{hero-name}.json`
   - General rules: `common.json`
2. FAQ structure:
   ```json
   {
     "faq-unique-id": {
       "q": "Question text (markdown supported)",
       "a": "Answer text (markdown supported)",
       "ref": ["card-id-1", "card-id-2"]
     }
   }
   ```
3. The `ref` array links FAQ to card IDs - cards with FAQs show [?!] indicator
4. Run `npm run build-data` to regenerate

### Translation Workflow
- English (`en`) is the source language in `public/locales/en.json`
- Build process generates `{locale}.missing.json` files showing untranslated keys
- Translators fill in missing translations and copy to `public/locales/{locale}.json`
- All supported locales defined in `src/stores/language.ts`

### AI-Assisted Translation Instructions
**Convention**: Language-specific AI translation instructions are stored as `public/locales/{locale}_ai_instructions.md`

These instruction files provide:
- Terminology glossaries (e.g., "Adjacent" → "benachbart", never "anliegend")
- Domain-specific translation rules (distinguish "Turn"/"Zug" vs "Round"/"Runde")
- Formatting preservation requirements (markdown, icons, line breaks)
- Terms that should NOT be translated (hero names, "Minion")
- Translation examples for clarity

**When helping with translations**:
1. ALWAYS check for and read the `{locale}_ai_instructions.md` file first
2. Follow the terminology and rules strictly - these ensure game consistency
3. Preserve all markdown formatting, icons (`::icon::`), and layout
4. If creating instructions for a new language, follow the pattern established in `de_ai_instructions.md`

Example: German translations must use "benachbart" for "adjacent" and "visieren" for "target" to match official game terminology.

## Important Conventions

### Card IDs
Format: `{hero-shortcode}-{color}-{tier}-{name-lowercase-dashed}`
Example: `arien-gold-i-swift-strike`

### FAQ IDs
Format: `faq-{hero-shortcode}-{unique-id}`
Example: `faq-ari-AbCd1234`

Auto-generated IDs are created for numeric keys to ensure uniqueness across files.

### Color System
Cards use colors: `gold`, `silver`, `red`, `green`, `blue`, `ultimate`, `black`, `purple`
See `src/types/Color.ts` for the Color enum.

### Expansion System
Heroes belong to expansions defined in `src/types/Expansion.ts`
Used for filtering heroes in the selection view.

## PWA Configuration

The app is a Progressive Web App (configured in `vite.config.ts:52-85`):
- Auto-updates on new versions
- Caches hero images, icons, fonts, and locale files
- Manifest configured for mobile install
- Base URL: `/goa2-faq/` (GitHub Pages deployment)

## Special Notes

- The build injects app metadata via Vite defines: `__APP_VERSION__`, `__APP_BUILD_HASH__`, `__APP_BUILD_DATE__`
- Locale JSON files are minified post-build via custom Vite plugin
- Hero icons are path-adjusted at runtime based on Vite base URL
- The companion store uses `@vueuse/core` for localStorage persistence
- Markdown rendering uses the `marked` library (see `src/helper/markdown.ts`)
