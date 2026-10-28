---
version: alpha
name: Biseo Herdr Dashboard
description: Design system for Biseo, an operations and agent multiplexer dashboard for a designated Herdr workspace.
---

## Overview

Biseo is an operational interface for monitoring and orchestrating agent panels within a designated Herdr workspace. The system provides clear situational visibility across pane allocations, an integrated single chat timeline, and D1 historical log retrieval.

This document adheres to the official [Google Labs DESIGN.md Specification](https://stitch.withgoogle.com/docs/design-md/specification) and the [google-labs-code/design.md spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md).

### System Scope & Core Views

The dashboard focuses on the designated Herdr workspace without multi-workspace routing or ancillary pages:
- **Workspace Dashboard**: Complete panel list of all panes in the designated workspace (name, agent, operational status).
- **Single Chat Timeline**: Integrated conversation stream with clear target/sender badges, rendering only completed final responses, alongside progress spinners for active runs.
- **Message Dispatch**: Input composer with deterministic disabled states and explicit reason displays when agents are busy, blocked, or in an unknown state.
- **History & Search**: D1-backed search and scrollable log retrieval for previous prompt/response turns.

### Technology Stack & State Architecture
- **Core Libraries**: React (19.3.1), shadcn/ui primitives, Tailwind CSS, React Router (`react-router@8.5.1` - peer compatible with React 19.3.1 / Node 24), Zustand, TanStack Query, ky, Zod.
- **State Responsibility Split**:
  - **Zustand**: Client/UI state management exclusively (drawer open/close, active filter toggles, local composer input draft, selection states).
  - **TanStack Query**: Server state and cache orchestration (panel list, agent status polling/invalidation, D1 timeline log history, cursor pagination).
- **Typography Strategy**: **Pretendard** serves as the primary typeface for UI labels, titles, and body content. For code snippets, command parameters, and terminal identifiers, a system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) is prioritized ahead of sans fallback.

## Colors

The visual identity is constructed from five foundational tones and their direct tonal variations:
- **Rich Black** (`#08090A`): Foundation dark background and maximum-contrast dark mode surface.
- **Deep Slate** (`#222823`): Dark mode container surface, card background, and subtle boundary framing.
- **Slate Gray** (`#575A5E`): Light mode secondary copy, muted borders, and subtle divider chrome.
- **Silver Gray** (`#A7A2A9`): Dark mode secondary copy, disabled control fills, and muted badge backgrounds.
- **Off White** (`#F4F7F5`): Light mode foundation background, surface cards, and dark mode high-contrast text.

### Herdr Agent State Mapping & Status Tokens

Rather than introducing unrelated saturated hues, lifecycle indicators derive directly from the five-tone palette with high-contrast text and icon pairings to ensure status is never conveyed by color alone. In particular, for `done` state inside dark mode (`surface-dark` / `#222823`), elements avoid placing identical `#222823` on `#222823`; instead, they use contrasting high-contrast text (`#F4F7F5`), silver icons (`#A7A2A9`), or a distinct outline (`border-subtle` / `#A7A2A9`) to guarantee unambiguous visual demarcation:

| Herdr Engine State | UI Display Label | Status Badge Treatment | Dispatch Availability |
| :--- | :--- | :--- | :--- |
| `idle` | Idle (대기) | Slate Gray outline + pause/check icon | Available (전송 가능) |
| `done` | Done (완료) | High-contrast text/icon + outline on dark card; Deep Slate fill on light card | Available (전송 가능) |
| `working` | Working (실행 중) | Off White / Slate Gray + spinning indicator | Disabled (전송 불가 — 실행 중) |
| `blocked` | Blocked (차단됨) | Deep Slate fill + alert triangle icon | Disabled (전송 불가 — 사용자/의존성 차단) |
| `unknown` | Unknown (알 수 없음) | Slate Gray dashed border + question icon | Disabled (전송 불가 — 상태 미확인 fail-closed) |

### Token Pair Contrast Verification (WCAG 2.1)

Contrast is verified for the primary foreground-on-background token pairings:

- **Light Mode (`surface` / `#F4F7F5`)**:
  - Primary text (`#08090A` on `#F4F7F5`): **18.48:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary text / Muted borders (`#575A5E` on `#F4F7F5`): **6.43:1** (Exceeds WCAG AA 4.5:1)
  - Dark container / Badge (`#222823` on `#F4F7F5`): **13.95:1** (Exceeds WCAG AAA 7.0:1)
  - Disabled control text (`#08090A` on `#A7A2A9`): **7.96:1** (Exceeds WCAG AAA 7.0:1)
- **Dark Mode (`canvas-dark` / `#08090A` & `surface-dark` / `#222823`)**:
  - High-contrast text (`#F4F7F5` on `#08090A`): **18.48:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary label text (`#A7A2A9` on `#08090A`): **7.96:1** (Exceeds WCAG AAA 7.0:1)
  - High-contrast text on card surface (`#F4F7F5` on `#222823`): **13.95:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary label text on card surface (`#A7A2A9` on `#222823`): **6.01:1** (Exceeds WCAG AA 4.5:1)

```yaml
colors:
  primary: "#08090A"
  surface: "#F4F7F5"
  surface-dark: "#222823"
  secondary: "#575A5E"
  muted: "#A7A2A9"
  canvas: "#F4F7F5"
  canvas-dark: "#08090A"
  border: "#575A5E"
  border-subtle: "#A7A2A9"
  status-idle: "#575A5E"
  status-done: "#222823"
  status-working: "#575A5E"
  status-blocked: "#222823"
  status-unknown: "#A7A2A9"
```

> [!NOTE]
> **Token Usage, Linter Referencing & Semantic CSS Mapping**:
> - `canvas-dark` serves as the root viewport background in dark mode, on which `panel-card-dark` and `timeline-bubble-agent` are layered.
> - `border` and `border-subtle` define structural separators, container dividing lines, and input outlines described in [Elevation & Depth](#elevation--depth).
> - `status-*` tokens (`status-idle`, `status-done`, `status-working`, `status-blocked`, `status-unknown`) define the semantic border/fill accents for agent status badge indicators in [Panel Overview Card](#1-panel-overview-card-panel-card) and are applied in conjunction with icons and explicit text labels. In dark containers, `status-done` pairs with contrasting text/icons rather than dark-on-dark fills.
> - **shadcn Semantic CSS Mapping**: Standard shadcn/ui color tokens (`--secondary`, `--muted`) conflict in semantic intent with this design system's `#575A5E` / `#A7A2A9`. To resolve naming collisions, shadcn CSS variables are mapped explicitly in `globals.css`:
>   - `--background`: mapped to `var(--canvas)` (`#F4F7F5` light / `#08090A` dark)
>   - `--foreground`: mapped to `var(--primary)` (`#08090A` light / `#F4F7F5` dark)
>   - `--card`: mapped to `var(--surface)` (`#F4F7F5` light / `#222823` dark)
>   - `--muted`: mapped to `#F4F7F5` (light fill) / `#222823` (dark fill)
>   - `--muted-foreground`: mapped to `var(--secondary)` (`#575A5E` light) / `var(--muted)` (`#A7A2A9` dark)
>   - `--border`: mapped to `var(--border-subtle)` (`#A7A2A9` light / `#575A5E` dark)

## Typography

Typographic scale follows a predictable hierarchy using Pretendard for universal copy and a dedicated monospace stack for technical tokens.

```yaml
typography:
  headline-display:
    fontFamily: Pretendard
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Pretendard
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Pretendard
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-md:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-md:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.02em
  code-mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
```

## Layout

### Responsive Breakpoints & Adaptive Menu

The layout overrides Tailwind's default breakpoints with Bootstrap standard responsive breakpoints:
- `sm`: `576px`
- `md`: `768px` (Sidebar drawer transition boundary)
- `lg`: `992px`
- `xl`: `1200px`
- `2xl`: `1400px`

```js
// tailwind.config.ts screens override
screens: {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
}
```

**Navigation & Page Structure**:
- **Mobile (`< md` / `< 768px`)**: Top application bar with a hamburger toggle opening an off-canvas drawer.
- **Desktop (`>= md` / `>= 768px`)**: Fixed vertical left navigation menu (240px width) displaying the designated workspace identity and primary view tabs.
- **Route Titles**: Dynamic page titles are maintained on navigation (e.g., `Panels — Biseo`, `Chat — Biseo`, `Search Logs — Biseo`).
- **Feature Modules**:
  - `workspace-dashboard`: Full panel grid/list of the designated Herdr workspace.
  - `chat-timeline`: Unified chat stream with agent identity badges and completed outputs.
  - `composer`: Input box with disabled status handling and explicit blocked rationale.
  - `history-search`: Scrollable historical turn logs backed by Cloudflare D1 query filters.

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  sidebar-width: 240px
  header-height: 56px
  input-bar-height: 64px
```

## Elevation & Depth

Visual depth is achieved through contrast differentiation and clean structural borders rather than blur shadows:

- **Surface Contrast**: In dark mode, cards sit on `#222823` with a 1px `#575A5E` border over the `#08090A` canvas.
- **Light Contrast**: In light mode, surface cards sit on `#F4F7F5` with subtle `#A7A2A9` division lines over the `#F4F7F5` foundation canvas.
- **Focus Rings**: Active interactive inputs use a 2px outline using the foreground contrast token.

## Shapes

Shapes prioritize utilitarian density with compact, consistent corner radii. Default shadcn/ui radius (`0.625rem` / `10px`) is explicitly overridden with DESIGN.md's `lg` (`8px`) for containers and `md` (`6px`) for controls:

```css
/* shadcn/ui radius override in globals.css */
:root {
  --radius: 0.5rem; /* 8px (rounded.lg) */
}
```

```yaml
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
```

## Components

### 1. Panel Overview Card (`panel-card`)
Displays each pane within the designated Herdr workspace:
- Displays pane identifier, assigned agent name (e.g., `sol`, `opus`, `gf`), and current Herdr state (`idle`, `done`, `working`, `blocked`, `unknown`).
- State is rendered with an accompanying semantic text label and icon badge.

### 2. Unified Chat Timeline (`timeline-bubble`)
Single stream representing the interaction sequence:
- Agent badge indicates sender or dispatch target (e.g., `[sol]`, `[opus]`).
- **Completed Responses Only**: Intermediate tool execution noise is omitted; only verified final agent responses are committed to the stream.
- **Inline Activity Spinner**: When an agent state is `working`, a loading spinner and status caption indicate active background progress.

### 3. Dispatch Composer (`composer-input`)
- Textarea with submission trigger.
- **Blocked / Busy Guard**: When the target agent is `working`, `blocked`, or `unknown`, user input is disabled.
- **Explicit Rationale Display**: When disabled, a clear callout (e.g., `"Agent 'opus' is currently working. Input disabled."` or `"Agent status is unknown. Fail-closed dispatch prevented."`) is displayed directly adjacent to the input.

### 4. D1 Log & History Viewer (`history-viewer`)
- Scrollable list for browsing previous agent turns stored in Cloudflare D1.
- Keyword search filter input querying log text and agent identifiers.

```yaml
components:
  panel-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  panel-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  timeline-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  timeline-bubble-agent:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  composer-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
  composer-button-disabled:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
```

## Motion & Transitions

### Motion Architecture
- **Standard CSS Transitions**: Default to lightweight CSS transitions (`transform`, `opacity` over `150ms-200ms ease-in-out`) for mobile drawer toggles, hover states, and input focus.
- **CSS Spinners**: Indeterminate progress spinners operate via CSS `@keyframes spin { to { transform: rotate(360deg); } }` at `800ms linear infinite`.
- **Motion Library Suggestion**: If complex gesture coordination or shared layout choreography is required across timeline updates, Framer Motion / Motion can be optionally integrated, keeping animations under 200ms.

### Reduced Motion Accessibility
All animations honor user accessibility preferences via `@media (prefers-reduced-motion: reduce)`:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
When reduced motion is active, spinners switch to a static progress icon and drawers transition instantaneously without sliding animation.

## Do's and Don'ts

### Do's
- **Do** disable the input composer and display an explicit reason when an agent is `working`, `blocked`, or `unknown`.
- **Do** treat `unknown` Herdr states with fail-closed behavior (disallow input submission).
- **Do** accompany status indicators with textual labels and icons alongside color shifts.
- **Do** use system monospace fonts for code and identifier elements.
- **Do** maintain fixed navigation on desktop (`>= md`) and a drawer on mobile (`< md`).
- **Do** provide `prefers-reduced-motion` fallbacks for all CSS animations.

### Don'ts
- **Don't** add arbitrary saturated colors for status indicators; derive tints and shades from the core neutral palette.
- **Don't** clutter the unified timeline with intermediate agent scratch tokens; display only final completed responses.
- **Don't** claim universal contrast pass across all possible arbitrary element combinations; verify and validate explicit token-pair contrasts.
- **Don't** introduce multi-workspace pickers or auxiliary management views outside the designated Herdr workspace scope.
