# Testing Strategy

## Overview
Carbon Compass targets **>95% code coverage** globally (Statements, Lines).

## Frameworks
- **Runner**: Vitest (V8 coverage engine)
- **Environment**: JSDOM
- **UI Testing**: Testing Library (`@testing-library/react`)

## Boundaries
- **Unit Tests**: Utility functions (`carbon-utils.ts`), formatters, math calculators.
- **Component Tests**: Dashboard metrics, progress bars, layout wrappers (`AppShell.tsx`), and simulators. Evaluated for precise prop-rendering and interaction triggers.
- **Excluded**: External integration boundaries (`use-carbon-data.tsx` Firebase bindings) and heavy container route wrappers, which are tested strictly via integration suites to prevent brittle unit coupling.

## Accessibility Testing
- Manual keyboard trapping/navigation tests.
- Audits using Lighthouse for ARIA labeling, headings, and semantic DOM structures.
