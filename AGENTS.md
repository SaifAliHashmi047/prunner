# AGENTS

## Commands (build/lint/test)
- Start Metro: `npm start` (see [package.json](file:///Users/pc/Desktop/workspace/ProjectRunner/package.json#L5-L11))
- Run app: `npm run ios` (iOS) / `npm run android` (Android)
- Lint: `npm run lint` (uses ESLint config in [.eslintrc.js](file:///Users/pc/Desktop/workspace/ProjectRunner/.eslintrc.js#L1-L4))
- Tests: `npm test` (Jest preset in [jest.config.js](file:///Users/pc/Desktop/workspace/ProjectRunner/jest.config.js#L1-L3))
- Single test file: `npm test -- __tests__/path/to/file.test.tsx`
- Single test name: `npm test -- __tests__/file.test.tsx -t "test name"`

## Architecture & structure
- React Native app; entry points: [App.tsx](file:///Users/pc/Desktop/workspace/ProjectRunner/App.tsx#L1) and [index.js](file:///Users/pc/Desktop/workspace/ProjectRunner/index.js#L1).
- Source under `src/`: `components/` (UI), `screens/` (navigation views), `services/` (API/helpers), `assets/` (static).
- Navigation via React Navigation (stack/tabs deps in [package.json](file:///Users/pc/Desktop/workspace/ProjectRunner/package.json#L12-L24)).
- Native projects live in `ios/` and `android/`; Metro config in [metro.config.js](file:///Users/pc/Desktop/workspace/ProjectRunner/metro.config.js#L1).
- No backend/database in this repo; external calls (if any) belong in `src/services`.

## Code style & conventions
- Language: TypeScript preferred (see [tsconfig.json](file:///Users/pc/Desktop/workspace/ProjectRunner/tsconfig.json#L1-L2)); JS allowed where present.
- ESLint: extends `@react-native` (see [.eslintrc.js](file:///Users/pc/Desktop/workspace/ProjectRunner/.eslintrc.js#L1-L4)); fix issues locally before commit.
- Prettier: singleQuote, trailingComma=all, arrowParens=avoid, bracketSpacing=false, bracketSameLine=true (see [.prettierrc.js](file:///Users/pc/Desktop/workspace/ProjectRunner/.prettierrc.js#L1-L7)).
- Naming: Components/PascalCase; hooks `useX`; constants `SCREAMING_SNAKE_CASE`; files for components `ComponentName.tsx`.
- Imports: prefer relative within `src/`; group: RN/third-party, project modules, local; no unused exports.
- Errors: fail fast with early returns; surface user-safe messages in UI; log with `console.warn/error` as needed.

## Tooling rules discovered
- No Cursor/Claude/Windsurf/Cline/Goose/Copilot instruction files found.
- Node version: >=18 (see [package.json engines](file:///Users/pc/Desktop/workspace/ProjectRunner/package.json#L46-L48)).
