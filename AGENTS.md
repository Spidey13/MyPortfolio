# Portfolio Agent Guide

## Project scope

This repository contains Prathamesh More's portfolio: a React/Vite frontend and TypeScript serverless API. Preserve the existing Git history and evolve the redesign in this repository rather than creating a parallel application.

## Active frontend architecture

- Entry point: `frontend/src/main.tsx`
- Route configuration: `frontend/src/App.tsx`
- Active portfolio shell: `frontend/src/redesign/PortfolioShell.tsx`
- Active home document: `frontend/src/redesign/AboutDocument.tsx`
- Active project document: `frontend/src/redesign/ProjectCaseStudy.tsx`
- Persistent identity/project rail: `frontend/src/redesign/ProjectIndexRail.tsx`
- Shared project visuals and metadata: `frontend/src/redesign/ProjectVisual.tsx` and `projectMeta.ts`
- Redesign styles: `frontend/src/redesign/redesign.css`
- Separately active demo route: `frontend/src/pages/DiagnostiqDemo.tsx`

Add new portfolio UI under `frontend/src/redesign/` and compose it through `PortfolioShell.tsx`. Keep `frontend/src/pages/DiagnostiqDemo.tsx` isolated as a separate demo route; do not recreate the removed legacy component/page architecture.

## Data and API

- Portfolio content lives under `frontend/src/data/`.
- Prefer data imports over hardcoded profile, experience, or project copy in components.
- Serverless handlers live under `api/`; shared backend code lives under `api/_lib/`.
- The frontend proxies `/api` to the local API server on port `3001`.
- Never commit API keys or other secrets from `.env` files.

## Local commands

Run from the repository root:

```powershell
npm run dev
npm run dev:api
npm run lint
npm run build
```

The frontend is served on port `5173`. Before completing React work, lint the changed files and run the production build. Do not fix unrelated legacy lint findings inside a feature issue; remove or repair legacy code in a dedicated cleanup change.

## Change discipline

- Keep each Linear issue on its own branch and include the issue identifier in the branch, commit, and pull-request title.
- When an issue depends on the unmerged redesign, branch from and merge back into the designated redesign integration branch.
- Keep commits scoped; do not mix generated artifacts, design-reference captures, dependency churn, or unrelated cleanup into feature work.
- Preserve keyboard navigation, focus handling, semantic landmarks, reduced-motion behavior, and responsive layouts.
- Confirm a component is reachable from an active entry point before modifying it; delete unreachable code only in a dedicated cleanup change.
