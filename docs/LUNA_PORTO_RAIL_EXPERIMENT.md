# Luna Handoff: Strictly Executable PORTO ROCHA Rail Experiment

## Read This First

Read this entire document before changing files or creating commits. This document is exhaustive. Implement exactly the documented structure, values, source-of-truth data, routes, interactions, and validation below.

Do not reinterpret PORTO ROCHA, search for or browse alternative references, redesign sections, install or update dependencies, write new copy, create screenshots or generated assets, edit project data, or substitute interactions. Use reasoning to execute this contract; reasoning does not grant design discretion.

Execution target: GPT-5.6 Luna with `reasoning.effort=high`.

Reference: <https://www.portorocha.com/>. This is the only permitted visual reference. Do not search for or consult alternatives.

Prompting reference: <https://developers.openai.com/api/docs/guides/latest-model>. The handoff uses its hard-constraint, approval-boundary, success-criteria, and ambiguity-stop principles.

Luna is authorized to read repository files, edit explicitly authorized front-end files, run required local validation, and record the required report. Luna must not push branches, modify the original branch, perform external writes, or expand scope.

Luna stops immediately and reports the exact condition, command, and affected path when any of these conditions occurs:

1. An instruction conflicts with the repository, its current data, an existing route, or an existing visual.
2. `codex/tile-portfolio-baseline` or `codex/porto-rail-experiment` already exists.
3. The tile baseline does not build with `npm run build` from `frontend`.
4. A file not explicitly authorized below appears in the staged diff.
5. A required source value, route, component, or diagnostic cannot be found.
6. Implementation requires a decision that this contract does not state.

Do not decide through a stop condition. Ask Prathamesh and wait for direction.

## Scope and invariants

The existing tile portfolio is the protected baseline. The PORTO ROCHA layout is a reversible experiment on a second branch. The finished site remains Prathamesh's portfolio and retains the current warm, dark identity, factual project content, analytics, external links, Diagnostiq demo route, and Ask drawer.

The experiment implements one persistent two-pane desktop shell:

- The left pane is an independently scrollable identity and project index.
- The right pane is the active document.
- The right pane initially displays About.
- Selecting a project keeps the left pane in place and replaces the right document with that project's case study.
- The name and one-liner at the top of the left pane are not sticky; they scroll away with the project index.
- Contact is the only visually pinned left-side control.
- About contains no Work gallery or duplicate Selected Work section.

No new dependencies, screenshots, generated assets, copywriting, project-data edits, API changes, backend changes, or unrelated documentation edits are authorized.

## Git safety and exact commit contract

### Starting state

Before any branch command, run:

```text
git status --short --branch
```

The original branch is `fix/portfolio-conversion-and-analytics`. Record the complete output. Do not commit on, merge into, rebase, reset, restore, delete, stash, or otherwise modify that original branch.

The worktree is already dirty. Existing changes belong to the user. Preserve every unlisted file and every unlisted file's contents exactly.

The known existing status is:

```text
M  .gitignore
D  docs/DESIGN.md
D  docs/IMAGES.md
M  frontend/index.html
M  frontend/package-lock.json
M  frontend/src/App.tsx
M  frontend/src/index.css
?? .VSCodeCounter/
?? CLAUDE.md
?? frontend/src/redesign/
```

If the current branch or repository state conflicts with this contract, stop and report before changing the index or worktree.

### Baseline branch

1. Confirm that neither required branch exists:

   ```text
   git show-ref --verify --quiet refs/heads/codex/tile-portfolio-baseline
   git show-ref --verify --quiet refs/heads/codex/porto-rail-experiment
   ```

   A zero exit status for either name is a stop condition.

2. Create `codex/tile-portfolio-baseline` from the current `fix/portfolio-conversion-and-analytics` `HEAD`. The original branch pointer remains unchanged.

3. Preserve the dirty worktree. Unstage unrelated index entries by explicit path so the staged set is exact; do not restore file contents, delete files, stash files, or use a broad staging command.

4. Stage exactly these paths, and no other path:

   ```text
   frontend/index.html
   frontend/src/App.tsx
   frontend/src/index.css
   frontend/src/redesign/PortfolioHome.tsx
   frontend/src/redesign/ProjectCaseStudy.tsx
   frontend/src/redesign/ProjectVisual.tsx
   frontend/src/redesign/projectMeta.ts
   frontend/src/redesign/redesign.css
   docs/LUNA_PORTO_RAIL_EXPERIMENT.md
   ```

5. Inspect the staged file list with:

   ```text
   git diff --cached --name-only
   ```

   It must equal the nine paths above exactly. Any extra path or missing path is a stop condition. The baseline commit must not contain `.VSCodeCounter/`, `CLAUDE.md`, `.gitignore`, `docs/DESIGN.md`, `docs/IMAGES.md`, or `frontend/package-lock.json`.

   If any listed baseline file contains changes that are not part of the current tile redesign, stop and report the path. Do not discard, rewrite, or separate that file independently.

6. From `frontend`, run `npm run build`. A baseline build failure is a stop condition. Do not repair the baseline before reporting it.

7. Commit the exact staged set with this exact message:

   ```text
   checkpoint: preserve tile portfolio redesign
   ```

8. Record the baseline branch name, commit hash, and the exact `git diff --cached --name-only` output captured immediately before the commit.

### Experiment branch

1. Create `codex/porto-rail-experiment` from the baseline commit. Do not create it from any other commit.
2. Make every experiment change only on `codex/porto-rail-experiment`.
3. Stage changed files with explicit path arguments. Never use `git add .`, `git add -A`, a repository-wide glob, or an equivalent broad staging command.
4. Before the experiment commit, inspect:

   ```text
   git diff --cached --name-only
   git diff --cached
   ```

   If an unauthorized path appears, stop and report. Do not commit.

5. Commit the experiment with this exact message:

   ```text
   feat: add persistent project index portfolio shell
   ```

6. Do not push either branch. Do not modify the original branch. Report the exact baseline staged-file list, experiment staged-file list, baseline hash, and experiment hash.

### Authorized experiment files

The experiment is authorized to change only these existing source files and these three named shell files:

```text
frontend/index.html
frontend/src/App.tsx
frontend/src/index.css
frontend/src/redesign/PortfolioHome.tsx
frontend/src/redesign/ProjectCaseStudy.tsx
frontend/src/redesign/ProjectVisual.tsx
frontend/src/redesign/redesign.css
frontend/src/redesign/PortfolioShell.tsx
frontend/src/redesign/ProjectIndexRail.tsx
frontend/src/redesign/AboutDocument.tsx
```

Create all three named shell files. Do not create any other source file. Do not modify `frontend/src/data/*`, `frontend/package.json`, any lockfile, the API, the backend, or any file outside the two explicit source lists in this document.

### Recovery command

The exact recovery instruction is:

```text
git switch codex/tile-portfolio-baseline
```

Switching to that branch is the complete tile recovery path. Do not report reset, restore, or cherry-pick instructions.

## Existing Code to Understand Before Editing

Read these files completely:

- `frontend/src/redesign/PortfolioHome.tsx`
- `frontend/src/redesign/ProjectCaseStudy.tsx`
- `frontend/src/redesign/ProjectVisual.tsx`
- `frontend/src/redesign/projectMeta.ts`
- `frontend/src/redesign/redesign.css`
- `frontend/src/App.tsx`
- `frontend/src/data/profile.ts`
- `frontend/src/data/experience.ts`
- `frontend/src/data/publications.ts`
- `frontend/src/data/projects.ts`
- `frontend/package.json`

Important existing behavior and data:

- `sortHomeProjects(PROJECTS)` defines the rail order.
- `projectMeta.ts` supplies `shortName`, `home.thesis`, and project-specific visual metadata.
- `ProjectVisual.tsx` supplies the project visual system.
- The existing project data, factual claims, analytics, external actions, Ask drawer, and Diagnostiq demo route remain in use.
- The current CSS uses existing warm identity tokens. Consolidate redesign rules; do not append a new full override layer.
- Do not modify `frontend/src/data/*`, package manifests, lockfiles, API files, backend files, or unrelated documentation.

Current project order:

1. `cachefault` (`p10`)
2. `Diagnostiq` (`p8`)
3. `Codiey` (`p6`)
4. `Queue Whisperer` (`p9`)
5. `Research Agent` (`p1`)
6. `StratSim` (`p3`)
7. `Wafer Defects` (`p4`)
8. `ReMind` (`p2`)
9. `Prompt Optimization` (`p5`)
10. `Audio–Lyric` (`p7`)

Do not silently omit or reorder projects.

## Desktop shell: exact structure and measurements

Desktop means viewport width `>= 960px`. At desktop widths, render this semantic structure:

```tsx
<div className="portfolio-shell">
  <aside className="project-rail">
    <div className="project-rail__scroller">
      <IdentityBlock />
      <ProjectIndex />
    </div>
    <ContactDock />
  </aside>
  <main className="document-pane" id="main-content">
    <ActiveDocument />
  </main>
</div>
```

The component responsibilities are fixed:

- `PortfolioShell` owns the persistent two-pane layout and route-to-document selection.
- `ProjectIndexRail` owns `IdentityBlock`, the About row, all ten project rows, the desktop scroller, and `ContactDock`.
- `ProjectIndexRail` remains mounted across every `/` and `/project/:id` route change.
- `AboutDocument` owns the About document and the Contact section, including the existing Ask drawer.
- `ProjectCaseStudy` remains the source of the existing case-study content and renders inside the right document pane.

Apply these exact desktop values:

```css
grid-template-columns: clamp(340px, 30.5vw, 390px) minmax(0, 1fr);
height: 100vh;
height: 100dvh;
```

- The rail width is exactly `clamp(340px, 30.5vw, 390px)`.
- The shell is full height and has exactly one hairline divider using the existing warm-white alpha border token.
- The page does not create a competing desktop scrollbar. The rail scroller and document pane are the two scroll containers.
- The identity block has exactly `344px` height and is ordinary content at the beginning of the rail scroller.
- The contact dock has exactly `72px` height and occupies the rail's non-scrolling flex area.
- The rail scroller uses native `overflow-y: auto` and a visible thin native scrollbar. Do not hide the scrollbar or replace it with a custom scrolling system.
- The document pane uses native `overflow-y: auto`.
- Contact is outside the rail scroller. It is laid out below the scroller and is not implemented with `position: sticky`.
- The identity block is not sticky, fixed, independently pinned, or duplicated elsewhere in the rail.

The identity block displays exactly:

```text
Prathamesh More
I turn ambiguous ideas into dependable AI systems people can actually use.
```

The identity block scrolls completely out of view. No Work, Experience, Publications, or additional About navigation appears above it.

## Project index: exact rows and presentation

The index starts with About, followed by the ten projects in the exact order listed above.

Every index row has these exact values:

- Row height: `98px`.
- Row padding: `16px`.
- Divider: one hairline between adjacent rows using the existing border token.
- Transition duration: `220ms`.
- The About row is text-only, labeled `About`, with no thumbnail, year, category, date, proposition, arrow, or other metadata.
- Each project row displays exactly one `65px × 65px` thumbnail, the metadata `shortName` as title, and the metadata `home.thesis` as a two-line proposition.
- Thumbnail-to-copy gap: `12px`.
- Project rows display no year, category, date, label, arrow, status, or other metadata.
- The title is one line with overflow clipped. The proposition is exactly two lines maximum with overflow clipped.
- Rows are real links with accessible names containing the project title and proposition.

Active rows have all three required states at the same time:

1. A contrasting background surface.
2. A persistent left accent rule using the existing lime accent token.
3. `aria-current="page"`.

The active About row receives the same three states. Inactive rows do not receive `aria-current`.

Hover changes only the existing row background tone. Focus-visible uses a visible outline with the same visual strength as the active background. Neither state changes layout, row height, thumbnail dimensions, or document content. Do not add thumbnail scaling, arrow movement, tile shrinking, 3D tilt, cursor effects, blur curtains, autoplay, or scroll hijacking.

The contact dock displays exactly:

```text
Contact ↗
```

It has a solid surface, a top hairline, and no availability copy. Its action remains visible at every rail scroll position. The rail scroller includes enough bottom padding for the final project row to remain fully reachable above the dock.

## Thumbnail contract

Render each project thumbnail from the corresponding existing `ProjectVisual` in its existing static representative state. Use a deliberate square crop inside the exact `65px × 65px` box.

Do not add screenshots, generated assets, poster files, autoplay, hover video, continuous rail animation, or any new animation system. Do not replace project visuals with gradients or unrelated artwork. A visual that animates in the case study has a static rail state; richer existing case-study visuals remain unchanged.

## Routing and right document

The left rail remains mounted while the right document changes. Route handling and shell structure are fixed as follows:

- `/` renders `AboutDocument` inside `PortfolioShell` and selects the About row.
- `/project/:id` validates the project ID, renders the existing `ProjectCaseStudy` content inside `PortfolioShell`, and selects the matching project row.
- A direct load of `/project/:id` renders the complete shell.
- An unknown project ID redirects to `/` with router replacement. It does not render a fallback project and does not crash.
- The existing `/demo/diagnostiq` route continues to render the existing Diagnostiq demo without modification.
- Browser Back and Forward restore the route and active row through the router history.
- Every route change sets the document pane scroll position to the top. Use the document pane, not `window`, for this operation.
- The left rail scroll position is not reset, saved, restored, or keyed by route; it persists because `ProjectIndexRail` remains mounted.
- `/#contact` renders `AboutDocument` and scrolls the right document pane to the Contact section after About mounts. It never scrolls the window.
- Contact from About uses `/#contact`. Contact from a project navigates to `/#contact`, renders About, and then scrolls the right document pane to Contact.
- Focus after keyboard activation lands on the Contact section heading. Ordinary pointer selection does not programmatically move focus.

After routing is correct, animate exactly one document presentation wrapper with:

- `220ms` duration.
- Opacity transition.
- `translateY(8px)` transition.
- No other route-transition animation.
- No blank gap between documents.
- With `prefers-reduced-motion: reduce`, the new document renders immediately with no transition.

## About document: exact order and content

The right document at `/` contains these sections in this exact order:

1. Opening identity
2. What I work on
3. Experience
4. Education
5. Publications
6. Interests
7. Contact

About has exactly one Work-related positioning section named `What I work on`; it has no `Work` heading, project gallery, Selected Work section, project cards, or project archive.

Use existing data verbatim:

- **Opening identity:** render `PROFILE.name` and `PROFILE.title`.
- **What I work on:** render `PROFILE.summary` verbatim as the positioning statement.
- **Experience:** render every entry in `EXPERIENCE` array order. Each entry displays exactly `role`, `company`, `duration`, and the first sentence of `star.result`. Do not display `location`, the rest of `star.result`, `impact`, `architecture`, metrics, technologies, competencies, soft skills, tags, company information, artifacts, or an expansion/disclosure control.
- **Education:** render `EDUCATION.degree`, `EDUCATION.university`, `EDUCATION.graduation`, `EDUCATION.gpa`, and every `EDUCATION.coursework` item verbatim.
- **Publications:** render every `PUBLICATIONS` entry in array order. Each record displays `title`, `outlet`, and `date` verbatim and links to its existing `url` in a new tab with `rel="noreferrer"`.
- **Interests:** retain the existing About interest copy verbatim:

  ```text
  I enjoy entering unfamiliar domains, learning how the people and systems inside them actually work, and building from that understanding.
  Outside engineering, football is the constant. I also play badminton, follow sports communities, watch anime, play League of Legends and sketch.
  ```

  Render the existing labels `Football`, `Competition`, `Anime`, `Games`, and `Sketching` as inline text. Do not turn them into decorative skill-chip walls or invent additional interests.

- **Contact:** render the existing `PROFILE.email` and existing profile links. Preserve the existing Ask drawer inside this section with its current copy and behavior. Do not add availability copy, new claims, or new contact interactions.

The document uses the existing warm near-black background, warm-white type, muted metadata, restrained lime accent, Manrope, IBM Plex Mono, hairline borders, `border-radius: 0`, and no new shadows. Do not add a new palette, typeface, card system, decorative grid, headshot card, or effect system.

## Case-study contract

Preserve the existing factual case-study content, project data, claims, limitations, external actions, and project-specific visuals verbatim. Do not rewrite claims, summarize away evidence, change metrics, or restructure project data.

Render the existing `ProjectCaseStudy` content inside the right document pane. Only the outer shell placement, route integration, right-pane scroll reset, and required persistent navigation can change.

Both `Previous` and `Next` project navigation controls remain present and keyboard reachable. Project titles and project actions are never hover-only. The existing Diagnostiq demo remains lazy-loaded and accessible at `/demo/diagnostiq`.

## Visual direction

Use the current visual identity without visually cloning PORTO ROCHA:

- Background: the existing near-black/warm charcoal token.
- Text: the existing warm-white token.
- Metadata: the existing muted warm-gray token.
- Accent: the existing restrained lime token plus existing project-specific muted accents.
- Typography: Manrope for display/body text and IBM Plex Mono for metadata, unchanged.
- Borders: hairlines only.
- Radius: `border-radius: 0` for the shell, rail rows, Contact dock, mobile index, and new About surfaces.
- Shadows: `box-shadow: none` for the shell, rail, rows, Contact dock, mobile index, and new About surfaces.
- Media: square/cropped in the index and existing case-study media in the right document.
- Density: compact index rhythm on the left and readable document rhythm on the right.

The persistent index/document relationship is the visual signature. Do not add effects to create another signature.

## Mobile contract

Mobile means viewport width `< 960px`. Do not squeeze the desktop split onto mobile.

Below `960px`, render one document column with:

- A normal-flow top bar exactly `64px` high.
- The top bar contains `Prathamesh More`, a `Projects` control, and the exact `Contact ↗` action.
- No desktop rail.
- No desktop Contact dock.
- No pinned mobile Contact dock.
- No independent left/right document scroll containers. The document is one scrollable column.

`Projects` opens a full-screen accessible index containing About and all ten project rows. The mobile index uses the same About text-only row and project thumbnail/title/two-line-proposition content and the exact `98px` row, `16px` padding, `65px × 65px` thumbnail, and `12px` copy gap values.

The mobile index behavior is fixed:

- It uses semantic dialog/disclosure behavior.
- Escape closes it.
- Focus is trapped only while it is open.
- Focus returns to the `Projects` control when it closes.
- Body scroll is restored on every close and unmount path.
- Selecting an item closes the index and opens the selected document.
- JavaScript motion being disabled leaves every item and action reachable.

The mobile Contact action navigates to `/#contact`, renders About, and scrolls the single document column to Contact. The desktop pinned dock is never rendered on mobile.

## Accessibility and performance contract

- Preserve a working skip link targeting `#main-content`.
- Render one `h1` per active document, followed by ordered `h2` and `h3` levels.
- Make every project row keyboard reachable with a useful accessible name.
- Set `aria-current="page"` on the active About or project row.
- Give informative visuals useful alt text and mark decorative visuals `aria-hidden="true"`.
- Make external-link destinations clear in accessible names; a visible `↗` is decoration only.
- Meet WCAG AA contrast for text, focus, active rows, and links.
- Respect `prefers-reduced-motion: reduce` with immediate readable documents and no smooth scrolling.
- Keep all information and actions available without hover, including on touch.
- Keep case-study copy and navigation readable with animations disabled.
- Keep the desktop native scrollbar visible and thin.
- Do not add Lenis, GSAP, ScrollTrigger, a carousel library, a smooth-scroll library, or any other dependency.
- Do not add an animation system. The only new motion is the locked `220ms` document opacity plus `translateY(8px)` transition.
- Do not run rich project visuals continuously in the rail; thumbnails use static `ProjectVisual` states.
- Reserve the exact thumbnail and cover dimensions to prevent layout shift.
- Clean up every observer, timer, and event listener on unmount.
- Preserve lazy loading for the Diagnostiq demo.
- Test at `200%` browser zoom without overlap, clipping, or unreachable controls.

## Prohibited changes

Do not:

- Delete, overwrite, or amend the tile-baseline branch.
- Implement on `fix/portfolio-conversion-and-analytics`.
- Push either branch.
- Browse for alternative references or copy PORTO ROCHA assets, text, project names, CSS, or source code.
- Add a Work, Selected Work, or project gallery section to About.
- Make the identity sticky, fixed, or pinned.
- Pin any left-side item except the desktop Contact dock.
- Hide the native rail scrollbar.
- Intercept wheel input, add scroll snapping, or hijack scrolling.
- Add screenshots, generated assets, autoplay, new animation systems, or new dependencies.
- Invent copy, screenshots, metrics, employers, clients, awards, outcomes, or availability statements.
- Replace existing project visuals with generic gradients.
- Remove routes, analytics, the Ask drawer, project data, factual claims, or external project actions.
- Modify `frontend/src/data/*`, package manifests, lockfiles, APIs, backends, or unrelated files.
- Stage any file outside the exact authorized lists.

## Exact implementation order

1. Run and record the starting Git status.
2. Confirm both required branch names are absent.
3. Create `codex/tile-portfolio-baseline` from the original branch without modifying the original branch.
4. Stage exactly the nine baseline paths, inspect the staged diff, run the baseline build from `frontend`, and create the exact checkpoint commit.
5. Create `codex/porto-rail-experiment` from the checkpoint hash.
6. Read every required source and data file completely.
7. Implement `PortfolioShell` and `ProjectIndexRail` with the exact desktop structure and measurements.
8. Implement `AboutDocument` in the exact section order with the exact existing data fields and the existing Ask drawer.
9. Render `ProjectCaseStudy` inside the persistent shell without changing its factual content or project data.
10. Implement exact route validation, right-pane top reset, hash Contact routing, persistent left scroll, and the locked transition.
11. Implement the exact mobile top bar and full-screen index below `960px`.
12. Consolidate redesign CSS and remove only rules made obsolete by this shell; do not append a new override layer.
13. Run every validation command and manual test below.
14. Fix only in-scope regressions, re-run all failed validations, inspect the final staged diff, and create the exact experiment commit.
15. Produce the final report with both branch names, both hashes, both staged-file lists, validation results, and the exact recovery command.

## Handoff audit

Before changing application source, reread this document and verify that every implementation instruction is an exact value, an explicit prohibition, a deterministic route, or a deterministic stop condition. Confirm that no unresolved discretionary language remains. Record `Handoff audit: pass` in the final report. A failed audit is a stop condition.

## Validation contract

Run these commands from `frontend` on the experiment branch:

```text
npm run build
npm run lint
```

Run the available React diagnostic with this exact decision order:

1. Inspect `frontend/package.json` for an existing React diagnostic script or executable and run it when present.
2. When no repository diagnostic exists, run the available `react-doctor` workflow.
3. When neither a repository diagnostic nor the `react-doctor` workflow exists, report `React diagnostic: unavailable in repository` and do not install one.

Every build, lint, and diagnostic result is reported as pass or fail. A failure is fixed before the experiment commit when the fix is within this contract. A pre-existing failure is proven by running the same check against the baseline commit and is reported separately from experiment regressions.

Manually inspect all four exact viewport sizes:

- `1440 × 900`
- `1280 × 720`
- `1024 × 768`
- `390 × 844`

Manually test all of these exact cases:

- Direct load of `/`.
- Direct load of `/project/p10` and `/project/p8`.
- Direct load of `/demo/diagnostiq`.
- Independent native scrolling of the left rail and right document at desktop widths.
- Identity scrolling fully out of the rail.
- Visible thin native rail scrollbar.
- Keyboard traversal through About and all ten project rows.
- Visible focus and `aria-current="page"` on the active row.
- Browser Back and Forward across `/`, `/project/p10`, and `/project/p8`.
- Contact from About.
- Contact from `/project/p10`.
- `/#contact` renders About and scrolls the right document to Contact.
- Reduced-motion rendering.
- `200%` browser zoom.
- A slow or missing thumbnail.
- Mobile Projects dialog Escape, focus return, body-scroll restoration, and item selection.
- Both Previous and Next project navigation controls.

The final report includes pass/fail results for every command, viewport, and manual test. Do not report an untested case as passed.

## Required final report

Luna's final response contains these sections and values:

1. **Branches and commits**
   - Original branch name.
   - `codex/tile-portfolio-baseline` name and checkpoint hash.
   - `codex/porto-rail-experiment` name and final hash.
2. **Staged files**
   - Exact baseline `git diff --cached --name-only` list captured before the checkpoint commit.
   - Exact experiment `git diff --cached --name-only` list captured before the final commit.
3. **Files changed**
   - Every changed file path, with no omitted path.
4. **Architecture**
   - Concise description of `PortfolioShell`, persistent `ProjectIndexRail`, `AboutDocument`, and the right-pane route behavior.
5. **Validation**
   - Handoff audit result.
   - Build result.
   - Lint result.
   - React diagnostic result or the exact unavailable statement.
   - All four viewport results.
   - Every manual-test result.
6. **Failures and regressions**
   - Pre-existing failures, proven against the baseline, listed separately from experiment failures.
7. **Remaining visual decisions requiring Prathamesh's judgment**
   - Report `None`. Any undocumented decision must have triggered a stop and a question instead of being made.
8. **Recovery**
   - Include this exact one-line command and no alternative recovery command:

     ```text
     git switch codex/tile-portfolio-baseline
     ```
