# Portfolio analytics

The portfolio uses PostHog as its only analytics system. The implementation is deliberately small: PostHog records broad behavior automatically, while a few stable properties and events explain what that behavior means.

## Questions this setup should answer

- Which projects earn a meaningful open, and which are skipped?
- Which sections hold attention long enough to count as reading?
- Do visitors inspect architecture, decisions, evidence, repositories, demos, or technical notes?
- Which paths lead to résumé views, LinkedIn visits, email intent, or use of the portfolio assistant?
- Do the interactive product demonstrations get used, not merely viewed?
- Where do visitors hesitate, repeatedly click, encounter an error, or leave?
- Which event links and applications send visitors who go on to inspect the work?

The data will not prove why somebody liked the work or whether they hired Prathamesh. It should identify strong and weak parts of the portfolio and point to sessions worth reviewing.

## Collection model

PostHog automatically collects:

- page views and page leaves, including React route changes;
- element clicks through autocapture;
- sessions and session replay;
- heatmaps, dead clicks, and rage clicks;
- browser exceptions and web performance;
- standard acquisition properties such as referrer and UTM parameters.

The app adds semantic attributes to important links and controls. These appear on `$autocapture` events as:

- `portfolio-action`
- `action-location`
- `project-id`
- `navigation-source`

The app also emits two custom events:

| Event | When it fires | Important properties |
| --- | --- | --- |
| `portfolio section viewed` | At least 25% of a major section remains visible for two seconds | `document_type`, `project_id`, `section_id`, `section_type`, `route_path` |
| `interactive demo used` | A visitor changes a meaningful state inside a product demo | `project_id`, `demo_id`, `interaction`, `result` |

The API emits PostHog's `$ai_generation` event for assistant requests. Browser tracing headers provide the anonymous PostHog distinct ID and session ID, so the server event can be associated with the same session. Raw questions and answers are not sent to PostHog. Only model, provider, agent, latency, token counts, lengths, error state, and degraded state are recorded.

## Production configuration

Use the same PostHog project token on the frontend and API. The variable names differ because Vite exposes only variables prefixed with `VITE_`.

```env
# Vercel frontend/build environment
VITE_POSTHOG_PROJECT_TOKEN=phc_...
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_POSTHOG_ENABLED=true
VITE_APP_ENVIRONMENT=production
VITE_APP_VERSION=<git-sha-or-release>

# Vercel serverless environment
POSTHOG_PROJECT_TOKEN=phc_...
POSTHOG_HOST=https://us.i.posthog.com
```

Analytics requires a production-mode build and a project token. In Vercel, scope `VITE_POSTHOG_PROJECT_TOKEN` to the Production environment only; do not expose it to Preview or Development deployments. `VITE_POSTHOG_ENABLED=false` is an emergency off switch for the frontend.

The PostHog MCP connection uses its own personal authentication. It is not the project token and does not belong in application environment variables.

## PostHog Actions

Actions give stable names to autocaptured behavior without adding another custom event for every click.

The following Actions are installed in the `AI Portfolio` project and tagged `portfolio-v2`:

| Action | Definition |
| --- | --- |
| Project opened | `$autocapture` where `portfolio-action = project_open` |
| Contact intent | `$autocapture` where `portfolio-action = contact_email` |
| Career interest | `$autocapture` where `portfolio-action` is `resume_open` or `linkedin_open` |
| Technical proof inspected | `$autocapture` where `portfolio-action` is `repository_open`, `technical_notes_open`, `live_demo_open`, `recorded_demo_open`, or `interactive_demo_open` |
| Assistant opened | `$autocapture` where `portfolio-action = assistant_open` |
| Assistant submitted | `$autocapture` where `portfolio-action = assistant_submit` |
| Assistant answered | `$ai_generation` where `$ai_is_error = false` and `degraded = false` |

Create `Qualified visit` as a session-level definition once real traffic establishes sensible thresholds. A useful first version is a session with at least one project open plus either a technical-proof action, two engaged sections, an assistant answer, or contact intent. Avoid treating time alone as qualification.

## Dashboard

A pinned `Portfolio Analytics v2` dashboard is installed in the project. It intentionally keeps the first release to eight useful views:

- portfolio sessions over the last 30 days;
- projects opened;
- sections people read;
- high-intent actions;
- interactive demo usage;
- the portfolio assistant funnel;
- referring domain and UTM source;
- sessions with frontend errors.

Do not add a `Qualified visit` metric yet. Define it after the new schema has collected enough production traffic to show realistic reading and proof-inspection patterns.

## Campaign links

Use UTMs on links shared outside the site. Keep values lowercase and stable.

```text
?utm_source=linkedin&utm_medium=profile&utm_campaign=portfolio
?utm_source=event_name&utm_medium=qr&utm_campaign=portfolio
?utm_source=job_application&utm_medium=application&utm_campaign=company_role
?utm_source=direct_outreach&utm_medium=email&utm_campaign=company_role
```

Do not put a person's name, email address, or other private information in a UTM value.

## Privacy and data quality

- Form inputs are masked in replay.
- Assistant questions and answers are marked sensitive and excluded from autocapture.
- The API does not store raw assistant text in PostHog.
- Anonymous visitors are not deliberately identified or converted into person profiles.
- Section events are limited to major content blocks and fire once per rendered route.
- The analytics schema version is registered as `2` on browser events.
- Do not add paragraph, scroll-percentage, hover, or cosmetic interaction events unless a concrete decision requires them.

## Release check

After deploying with the production variables:

1. Open the production site with PostHog Live Events visible.
2. Confirm one `$pageview` per route change and one `$pageleave` when leaving.
3. Open a project from both desktop and mobile navigation and inspect the semantic properties.
4. Hold a major section in view for two seconds and confirm a single `portfolio section viewed` event.
5. Use each interactive demo and confirm `interactive demo used`.
6. Submit an assistant question and confirm a stitched `$ai_generation` with no raw prompt or response.
7. Inspect a replay and verify the assistant input and response are masked.
8. Verify development traffic does not appear in the production project.

Use this check before trusting a dashboard. An empty chart can mean either no behavior or broken instrumentation.
