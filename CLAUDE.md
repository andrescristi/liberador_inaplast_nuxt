## TECH STACK VERSIONS

### Framework & Core
- **Nuxt**: 4.0.3 (Latest)
- **Vue**: Latest (3.x)
- **TypeScript**: 5.6.2

### State Management & Authentication
- **Pinia**: @pinia/nuxt 0.11.2
- **Supabase**: @nuxtjs/supabase 1.6.0, @supabase/supabase-js 2.53.0

### UI & Styling
- **TailwindCSS**: @nuxtjs/tailwindcss 6.14.0, tailwindcss 3.4.0
- **Headless UI**: @headlessui/vue 1.7.23
- **Icons**: @nuxt/icon 1.15.0 with @iconify-json/bx 1.2.2

### Utilities & Features
- **VueUse**: @vueuse/nuxt 13.6.0
- **Form Validation**: @vee-validate/nuxt 4.15.1, @vee-validate/zod 4.15.1
- **OCR**: @google/genai 1.15.0, tesseract.js 6.0.1
- **Logging**: pino 9.9.0
- **Validation**: zod 3.25.76

### Testing & Development
- **Vitest**: 3.2.4 (Unit Testing)
- **Playwright**: @playwright/test 1.54.2 (E2E Testing)
- **Vue Testing Library**: @testing-library/vue 8.1.0
- **Test Utils**: @nuxt/test-utils 3.19.2
- **ESLint**: @nuxt/eslint 1.7.1, @antfu/eslint-config 5.2.0

### Package Management
- **pnpm**: Preferred package manager

## AGENTS
Use the available agents whenever you can.

## DOCUMENTATION
Whenever you need to use documentation, use context7 mcp to extract the most up to date docs.

## MCP
Use all available MCP servers and tools.
Use Context7 MCP to get most up to date documentation. If Context7 MCP is not available, use Ref MCP.

## PLAYWRIGHT
Whenever you need to take an screenshot, save it in the screenshot folder, in the project's root path  

## COMMANDS
Always use pnpm instead of npm. Example: Bash(pnpm run lint)

## CHANGES
Whenever you make changes to the codebase, use lint and tsc to check if there are any problems with the code. Always use Bash(npx tsc --noEmit) instead of typecheck. After doing this, you must run Bash(pnpm build)

## DEBUGGING
Whenever you create an special file for debugging purposes and solve the issue, remember to delete the debugging file

## LANGUAGE
All messages to the user and errors must be in spanish
- All labels and messages shall be in spanish
- All playwright reports and screenshots must go in the screenshots folder

## ARCHITECTURE NOTES
- **Nuxt 4**: Using srcDir: 'app/' structure with optimized auto-imports
- **Auto-Imports**: Configured for ~/composables/** pattern to handle nested directories
- **Testing**: Comprehensive test coverage with Vitest and Playwright
- **TypeScript**: Strict mode enabled with proper type safety

