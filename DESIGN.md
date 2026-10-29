---
version: alpha
name: Biseo Herdr Dashboard
description: Design system for Biseo, an operations and agent multiplexer dashboard for a designated Herdr workspace.
---

## Overview

Biseo is an operational interface for monitoring and orchestrating agent panels within a designated Herdr workspace. The system provides clear situational visibility across pane allocations, an integrated single chat timeline, and refined responsive choreography.

This document adheres to the official [Google Labs DESIGN.md Specification](https://stitch.withgoogle.com/docs/design-md/specification) and the [google-labs-code/design.md spec](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md).

### System Scope & Milestone Boundary (0.3.1 vs 0.3.2)

Following milestone reprioritization, milestone **0.3.1 (#25)** focuses strictly on the design system, mobile tabs/carousel UX, and responsive single chat interactions. D1 historical log retrieval and persistence search have been scheduled for milestone **0.3.2 (#24)**:

- **Workspace Dashboard (0.3.1)**: Panel display of active panes in the designated workspace (name, agent, operational status) arranged via horizontal carousel/tabs on mobile to eliminate excessive vertical scrolling.
- **Single Chat Timeline (0.3.1)**: Integrated conversation stream with clear target/sender badges, rendering only completed final responses, alongside progress spinners for active runs.
- **Message Dispatch (0.3.1)**: Input composer allowing continuous editing in textarea with send button gating and deterministic reason displays when agents are busy, blocked, or disconnected (turn reservation planned for 0.3.1). Textarea strictly enforces CSS `resize: none` with fixed height and internal scrolling.
- **History & Search (Deferred to 0.3.2 #24)**: D1-backed search and historical turn log retrieval. The 0.3.1 UI reserves the navigation tab slot and visual specifications, but backend query integration is bound in 0.3.2.

### Technology Stack & State Architecture
- **Core Libraries**: React (19.3.1), shadcn/ui primitives (`Tabs`, `Carousel`, `Card`, `Badge` etc. — bespoke reinvention is strictly prohibited), Tailwind CSS, React Router (`react-router@8.5.1` - peer compatible with React 19.3.1 / Node 24), Zustand, TanStack Query, ky, Zod.
- **State Responsibility Split**:
  - **Zustand**: Client/UI state management exclusively (mobile tab index, carousel active snap, drawer open/close, composer draft, selection states).
  - **TanStack Query**: Server state and cache orchestration (panel snapshot list, agent status invalidation, timeline events, cursor pagination).
- **Typography Strategy**: **Pretendard** serves as the primary typeface for UI labels, titles, and body content. For code snippets, command parameters, and terminal identifiers, a system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) is prioritized ahead of sans fallback.

## Colors

The visual identity is constructed from five foundational tones and their direct tonal variations:
- **Rich Black** (`#08090A`): Foundation dark background and maximum-contrast dark mode surface.
- **Deep Slate** (`#222823`): Dark mode container surface, card background, and subtle boundary framing.
- **Slate Gray** (`#575A5E`): Light mode secondary copy, primary light borders, and subtle divider chrome.
- **Silver Gray** (`#A7A2A9`): Dark mode secondary copy, disabled control fills, primary dark borders (`border-subtle`), and high-contrast dark badge elements.
- **Off White** (`#F4F7F5`): Light mode foundation background, surface cards, and dark mode high-contrast text.
- **Surface Subtle** (`#E2E6E3`): Light mode subtle container fill, mapped directly to `--muted`.

### Herdr Agent State Mapping & Status Tokens

Visual status indicators represent engine health, while message dispatching is strictly governed by `sendable: boolean` and explicit `disabledReason` tokens. Status is never conveyed by color alone.

#### 1. PaneStatus Display Tokens (Presentation Only)
`PaneStatus` communicates current engine lifecycle state in UI badges paired with semantic icons. To maintain WCAG 2.1 Non-text Contrast (>= 3:1) on dark container surfaces (`#222823`), dark variants unify on high-contrast `#A7A2A9` outlines/fills:

| Herdr Engine State | UI Display Label | Light Badge Treatment | Dark Badge Treatment (>= 3:1 Contrast) | Visual Icon Pairing |
| :--- | :--- | :--- | :--- | :--- |
| `idle` | Idle (대기) | Slate Gray outline (`#575A5E`) | Silver Gray outline (`#A7A2A9`, **6.01:1**) | Pause / Clock icon |
| `done` | Done (완료) | Deep Slate fill (`#222823`) | Deep Slate fill + Silver Gray border (`#A7A2A9`, **6.01:1**) + Off White text (`#F4F7F5`, **13.95:1**) | Checkmark icon |
| `working` | Working (실행 중) | Off White / Slate Gray fill | Silver Gray text & spinner (`#A7A2A9`, **6.01:1**) | Animated CSS spinner |
| `blocked` | Blocked (차단됨) | Deep Slate fill (`#222823`) | Deep Slate fill + Silver Gray border (`#A7A2A9`, **6.01:1**) + Off White text (`#F4F7F5`, **13.95:1**) | Alert triangle icon |
| `unknown` | Unknown (알 수 없음) | Slate Gray dashed border (`#575A5E`) | Silver Gray dashed border (`#A7A2A9`, **6.01:1**) | Help question icon |

#### 2. Dispatch Gating & DisabledReason Mapping (7 Reasons)
Message dispatch gating is deterministically governed by `sendable` and `disabledReason` (derived from `src/domain/pane-reason.ts` and `web/domain/paneState.ts`). In 0.3.0, the input/textarea remains continuously editable while only the send button is disabled when `sendable` is `false` or an agent is busy. Dispatch reservation UI is scheduled for milestone 0.3.1. The textarea strictly enforces `resize: none` with a fixed height and internal scrolling. Deterministic rationale messages display in a companion callout/alert:

| DisabledReason Token | User-Facing Korean Rationale | Trigger Condition |
| :--- | :--- | :--- |
| `agent_busy` | 에이전트가 실행 중이거나 작업 락이 걸려 있습니다. | `status === 'working'`, `launch_pending === true`, or pane lock held |
| `agent_blocked` | 에이전트가 사용자 입력 또는 의존성으로 인해 차단되었습니다. | `status === 'blocked'` |
| `agent_unknown` | 에이전트 상태를 확인할 수 없습니다 (fail-closed). | `status === 'unknown'` or `interactive_ready === false` |
| `no_agent_in_pane` | 패널에 실행 중인 에이전트가 없습니다. | Pane lacks active agent runtime (`!agentKind`) |
| `response_capture_unavailable` | 이 에이전트의 완료 응답 수집은 아직 지원하지 않습니다. | Agent session does not support deterministic response capture |
| `target_not_found` | 대상 패널을 찾을 수 없습니다. | Selected paneId does not exist in workspace snapshot |
| `connection_unavailable` | 서버/SSE 연결이 끊어졌거나 오프라인 상태입니다. | EventSource disconnected, offline, or network error |

#### 3. PaneSummary Domain Field Mapping
Data received from the server snapshot conforms strictly to `PaneSummary` (`web/domain/timeline.ts`):
- `name`: Fixed primary card title (`item.name`). Terminal command leakage is sanitized on the server.
- `agentName`: Optional secondary agent alias (e.g., `opus`, `sol`, `gf`). Displayed as a subtle secondary caption (`label-sm`).
- `agentKind`: Execution runtime tool (e.g., `claude`, `codex`, `agy`). Rendered as a distinct secondary tag pill (`label-sm`).
- `status`: Engine state for display badges (`idle`, `done`, `working`, `blocked`, `unknown`).
- `sendable`: Boolean dispatch gate.
- `disabledReason`: Deterministic disable rationale from the 7 reasons above.

### Token Pair Contrast Verification (WCAG 2.1)

Contrast is verified for typography and non-text UI components (WCAG 2.1 SC 1.4.3 & 1.4.11):

- **Light Mode (`surface` / `#F4F7F5`)**:
  - Primary text (`#08090A` on `#F4F7F5`): **18.48:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary text (`#575A5E` on `#F4F7F5`): **6.43:1** (Exceeds WCAG AA 4.5:1)
  - Non-text border / Divider (`#575A5E` on `#F4F7F5`): **6.43:1** (Exceeds WCAG Non-text 3.0:1)
  - Dark container / Badge (`#222823` on `#F4F7F5`): **13.95:1** (Exceeds WCAG AAA 7.0:1)
  - Focus Ring (`--ring` / `#08090A` on `#F4F7F5`): **18.48:1** (Maximum focus visibility)
- **Dark Mode (`canvas-dark` / `#08090A` & `surface-dark` / `#222823`)**:
  - High-contrast text (`#F4F7F5` on `#08090A`): **18.48:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary label text (`#A7A2A9` on `#08090A`): **7.96:1** (Exceeds WCAG AAA 7.0:1)
  - High-contrast text on card surface (`#F4F7F5` on `#222823`): **13.95:1** (Exceeds WCAG AAA 7.0:1)
  - Secondary label text on card surface (`#A7A2A9` on `#222823`): **6.01:1** (Exceeds WCAG AA 4.5:1)
  - Non-text border / Divider (`#A7A2A9` on `#222823`): **6.01:1** (Exceeds WCAG Non-text 3.0:1)
  - Focus Ring (`--ring` / `#F4F7F5` on `#222823`): **13.95:1** (Maximum focus visibility)
- **Dark Mode Badge Contrast Assurance (3:1 Non-Text Boundary)**:
  - On dark surfaces (`#222823`), raw `#575A5E` achieves only **2.17:1** contrast (fails 3:1 threshold). Therefore, dark badges unify on `#A7A2A9` for outlines, text, and spinners, achieving **6.01:1** (exceeding 3:1).
  - Dark badge fills (`status-done`, `status-blocked` using `#222823`) are explicitly framed with a 1px `#A7A2A9` border (**6.01:1**) and `#F4F7F5` text (**13.95:1**), guaranteeing unambiguous visual separation.
  - The `timeout` status outline uses `#A7A2A9` (**6.01:1**) instead of dark fills to resolve 1:1 invisible outlines.

```yaml
colors:
  primary: "#08090A"
  surface: "#F4F7F5"
  surface-dark: "#222823"
  secondary: "#575A5E"
  muted: "#E2E6E3"
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
> **shadcn/ui Semantic CSS Mapping & Relation to `web/theme.css`**:
> While `web/theme.css` defines a flat token palette (`--primary: #08090A; --secondary: #A7A2A9; --surface: #F4F7F5; --muted: #575A5E; --accent: #222823;`), the complete shadcn/ui component system requires bidirectional semantic mapping across light and dark modes with dedicated `.dark` overrides:
>
> ```css
> :root {
>   --background: var(--color-canvas); /* #F4F7F5 */
>   --foreground: var(--color-primary); /* #08090A */
>   --card: var(--color-surface); /* #F4F7F5 */
>   --card-foreground: var(--color-primary); /* #08090A */
>   --secondary: var(--color-secondary); /* #575A5E */
>   --secondary-foreground: var(--color-canvas); /* #F4F7F5 */
>   --muted: #E2E6E3; /* surface-subtle (defined in CSS / tokens) */
>   --muted-foreground: var(--color-secondary); /* #575A5E */
>   --border: var(--color-border); /* #575A5E (6.43:1 on light) */
>   --ring: var(--foreground); /* #08090A */
> }
>
> .dark {
>   --background: var(--color-canvas-dark); /* #08090A */
>   --foreground: var(--color-canvas); /* #F4F7F5 */
>   --card: var(--color-surface-dark); /* #222823 */
>   --card-foreground: var(--color-canvas); /* #F4F7F5 */
>   --secondary: var(--color-surface-dark); /* #222823 */
>   --secondary-foreground: var(--color-canvas); /* #F4F7F5 */
>   --muted: var(--color-surface-dark); /* #222823 */
>   --muted-foreground: var(--color-border-subtle); /* #A7A2A9, 6.01:1 on #222823 */
>   --border: var(--color-border-subtle); /* #A7A2A9 (6.01:1 on #222823, exceeds 3:1) */
>   --ring: var(--foreground); /* #F4F7F5 */
> }
> ```
> This ensures that `--border` (`border-border`) maintains at least **6.01:1** non-text contrast in dark mode, and `--ring` universally tracks `--foreground` (`ring-ring`).

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
- **Mobile (`< md` / `< 768px`) — Tabs & Carousel Driven UX**:
  - **No Excessive Vertical Scrolling**: Stacking multiple panel cards vertically down the page is strictly prohibited. The viewport must maintain compact ergonomics for one-handed operational control.
  - **View Switching Tabs (`shadcn Tabs`)**: Uses shadcn `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`) to cleanly switch between primary views: **Panels (패널)** ↔ **Chat (채팅)** ↔ **History (히스토리, 0.3.2)**.
  - **Horizontal Panel Carousel (`shadcn Carousel` backed by Embla)**:
    - **Active Card ↔ Composer Target Binding**: Swiping or snapping to an active pane card in the carousel (`api.selectedScrollSnap()`) immediately updates the Zustand UI state (`composer.targetPaneId`).
    - **Chat Transition Persistence**: When the user switches to the Chat tab, the active target pane selected in Panels remains intact, ensuring seamless context transition.
    - **Card Sizing & Peek Pattern**: Cards use `basis-[82%]` (or `85%`) width, allowing a 15–18% peek of the adjacent card to intuitively hint horizontal swipeability without horizontal scrollbars.
    - **Pane Cardinality States**:
      - `0 Panes`: Displays an accessible Empty State callout ("활성 에이전트 패널이 없습니다").
      - `1 Pane`: Hides Carousel previous/next navigation buttons and locks the single card centered.
      - `Multiple Panes`: Activates full touch swipe and keyboard navigation.
    - **URL Query & Browser Back Navigation**: Synced bi-directionally with browser URL parameters (`?tab=panels&pane=w1T:p2`). Triggering browser back/forward accurately restores the previous tab and pane selection.
    - **Deleted Pane Fallback**: If a selected pane is closed/removed from the live snapshot, selection automatically falls back to the first available valid pane, or transitions to the empty state if none remain.
  - **Off-Canvas Drawer**: Secondary controls, connection details, and theme toggles are tucked inside a sliding sheet/drawer accessed from the top header hamburger icon.
- **Desktop (`>= md` / `>= 768px`) — Structured Split Layout**:
  - Fixed vertical left navigation menu (240px width) displaying the designated workspace identity and primary view tabs.
  - Side-by-side split layout providing immediate overview of all agent panes alongside the live chat timeline and message dispatch composer.
- **Route Titles**: Dynamic page titles are maintained on navigation (e.g., `Panels — Biseo`, `Chat — Biseo`, `Search Logs — Biseo`).
- **Feature Modules**:
  - `workspace-dashboard`: Horizontal carousel/card presentation of the designated Herdr workspace.
  - `chat-timeline`: Unified chat stream with agent identity badges, completed turn cards, and failure indicators.
  - `composer`: Input box with deterministic disabledReason gating and explicit reason callouts.
  - `history-search`: (Scheduled for 0.3.2) Historical turn logs backed by Cloudflare D1 query filters.

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

- **Surface Contrast & Non-Text Borders (WCAG 3:1)**:
  - In light mode, surface cards sit on `#F4F7F5` with a 1px `#575A5E` border (`colors.border`, **6.43:1** contrast) ensuring crisp non-text demarcation.
  - In dark mode, cards sit on `#222823` with a 1px `#A7A2A9` border (`colors.border-subtle`, **6.01:1** contrast) over the `#08090A` canvas.
- **Focus Rings (`--ring`)**:
  - Interactive inputs and carousel controls use a 2px outline mapped directly to `foreground` (`#08090A` in light / `#F4F7F5` in dark), delivering **18.48:1** maximum focus ring visibility.

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

### 1. View Navigation Tabs & Application Bar (`app-tabs`, `app-header`)
Provides top-level situational awareness and view switching:
- **Navigation Tabs (`shadcn Tabs`)**: Reuses standard shadcn `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`) for instant switching between **Panels** ↔ **Chat** ↔ **History (0.3.2)** views on mobile. Prevents multiple view sections from simultaneously consuming vertical space.
- **Keyboard Navigation**: Adheres to WAI-ARIA `tablist` standards, allowing Left/Right arrow key cycling, Home/End jumping, and clear focus indicator rings.
- **Stream Status Indicator**: Replaces raw unstyled text with a clean 8px indicator dot paired with concise status copy (`label-sm`).
- **Workspace Identity**: Prominently displays the current workspace identifier with subtle badge styling.
- **Header Actions**: Refresh and navigation drawer toggles adhere to secondary button styling (`rounded.md`, 8px padding, smooth hover transition) instead of unstyled dark rectangular blocks.

### 2. Panel Horizontal Carousel & Overview Card (`panel-carousel`, `panel-card`)
Renders agent pane status while eliminating excessive vertical scrolling and visual clutter:
- **Card Hierarchy**: The primary card title is strictly bound to `name` (`item.name`). `agentName` (e.g., `opus`, `sol`) serves as an optional secondary sub-caption, while `agentKind` (e.g., `claude`, `codex`, `agy`) renders in an isolated secondary pill tag.
- **Horizontal Carousel (`shadcn Carousel` backed by Embla)**: Reuses shadcn `Carousel` (`CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`). In mobile viewports (`< md`), panel cards are arranged exclusively in a horizontal swipeable track governed by Embla Carousel APIs. **Stacking panel cards vertically down the page is strictly prohibited**.
- **Touch Gesture & Keyboard Support**: Supports natural touch swipe gestures with momentum scrolling, drag threshold resistance, and Left/Right arrow key navigation for keyboard accessibility.
- **Filtered Scope (Security Policy #27)**: Non-agent terminal panes and raw shell commands are strictly excluded; panes without agent runtimes are never rendered as cards.
- **State Badge & Icons**: Herdr engine states are presented with dedicated status badges pairing explicit labels and semantic icons (pause, check, spinner, triangle, question). Status is never communicated via color alone.
- **Clean Card Interior**: Lengthy reason disclaimers (e.g., capture unsupported messages) are excluded from the card surface to avoid visual noise; instead, unavailable actions are cleanly indicated via disabled badge icons, while detailed rationale is deferred to the composer dispatch view.

### 3. Unified Chat Timeline & Turn Status Matrix (`timeline-bubble`)
Single chronological stream representing interactions across all designated workspace agents:
- **Chat Bubble Choreography**: User dispatches align to the right (`chat-bubble-user`, surface container), while agent responses align to the left (`chat-bubble-agent`, white/surface-dark container). Each bubble displays the target pane name and timestamp (`HH:mm`), preserving the engine/turn status icon and cancel trigger.
- **Scroll Container & dvh Architecture**: The timeline operates within a fixed-height scroll container anchored to dynamic viewport units (`height: calc(100dvh - ...); min-height: 360px; overscroll-behavior: contain`).
- **Auto-Scroll & Reading Position Preservation**: When new messages arrive or turn statuses transition:
  - If the user is near the bottom (within a 64px threshold), the view smoothly auto-scrolls to the bottom.
  - If the user has scrolled up to review history, current scroll position is preserved without jumping, and an accessible '새 메시지' jump button (down arrow icon + label, min 44px touch target) is displayed.
- **Exclusion of Tool Noise Only**: Intermediate agent scratchpad operations, command-line arguments, and raw terminal stream noise are omitted.
- **Markdown Sanitization**: Agent completed markdown responses must pass through strict sanitization (or fallback to plain text) to prevent XSS and malformed layout injection.
- **Comprehensive Turn State Representation**: All turn completions, failures, timeouts, and uncaptured dispatches are committed to the timeline with explicit semantic badges and status callouts. No terminal turns are silently swallowed.
- **Retry Policy (Indeterminate Delivery Guard)**: Per `docs/contracts-0.3.0.md` and `src/app/prompt-error.ts`, a retry action is permitted **only for pre-send failures** (client-side validation errors or network failures prior to server dispatch). Once sent, outcomes with uncertain execution (`delivery_uncertain`, `agent_prompt_stalled`, `timeout`) **strictly forbid automatic or one-click prompt re-dispatch** to prevent unintended duplicate side-effects.
- **TurnStatus 8-State Matrix**:

| TurnStatus Token | Visual Badge Treatment | Icon Pairing (Lucide) | Content Display & User Guidance | Retry Availability |
| :--- | :--- | :--- | :--- | :--- |
| `queued` | Slate Gray outline (Light) / Silver outline (Dark, **6.01:1**) | `Clock` icon | Prompt queued / reserved for busy panel; cancellation button (`DELETE /api/turns/:requestId`) exposed | Cancellation permitted |
| `working` | Off White / Slate fill (Light) / Silver spinner (Dark, **6.01:1**) | `Loader2` (spinning) | Agent is processing turn; live working indicator displayed | N/A (In flight) |
| `completed` | Deep Slate fill / high contrast + Silver outline (Dark) | `CheckCircle2` icon | Agent response text rendered with sanitized markdown; supports late completion upgrade after timeout | N/A (Completed) |
| `capture_unavailable` | Silver Gray fill / outline | `Info` icon | Prompt recorded; displays "이 에이전트의 완료 응답 수집은 아직 지원하지 않습니다." | Disallowed |
| `blocked` | Deep Slate fill + Silver outline (Dark, **6.01:1**) | `AlertTriangle` icon | Prompt recorded; displays dependency/user intervention block | Disallowed |
| `failed` | Slate Gray fill + Silver outline (Dark, **6.01:1**) | `XCircle` icon | Displays error message; if `delivery_uncertain`, renders tooltip guidance: "전달 여부 불확실, 재전송 시 중복 가능"; automatic or one-click retry is strictly forbidden | Pre-send only |
| `timeout` | Deep Slate outline (Light) / Silver outline (Dark, **6.01:1**) | `Timer` icon | Prompt recorded; displays "계속 수집 중(최대 2시간)" indicator; accepts late `completed` upgrade up to 2 hours | Disallowed |
| `cancelled` | Slate Gray outline (Light) / Silver outline (Dark, **6.01:1**) | `Ban` icon | Prompt cancelled while queued prior to dispatch; terminal state | Disallowed |

### 4. Dispatch Composer (`composer-input`) & Unified Capsule Container
- **Unified Chat Capsule (`composer-box`)**: Textarea and circular send button are housed within a unified container with standard DESIGN radius (`border-radius: var(--r-lg); border: 1px solid var(--secondary); background: #fff; padding: 0.5rem;`). Symmetrical inner padding eliminates awkward baseline offsets.
- **Default 2-Line Input & Internal Scrolling**: The textarea defaults to 2 lines (`rows={2}; min-height: 2.8rem; max-height: 6rem; resize: none; overflow-y: auto; font-size: 16px; line-height: 1.4; padding: 0.375rem 0.5rem;`), keeping placeholder text and user input vertically balanced and preventing unwanted iOS zoom.
- **Target Placeholder**: Target pane identity is cleanly integrated into the input placeholder (e.g., `'ds-g에게 메시지'`, or fallback `'대상 패널을 선택하세요'`) to eliminate redundant vertical header banners.
- **Single-Line Flex & Bottom Alignment**: Textarea (`flex: 1; min-width: 0`) and bottom-aligned action controls (`.composer-actions { align-items: flex-end; align-self: flex-end; }`) are aligned on a single row without wrapping (`flex-wrap: nowrap`), even on narrow 320px mobile viewports.
- **Circular Send Button (`btn-send-round`) & Reason Icon**: The 44px circular send button (`min-width: 44px; min-height: 44px; border-radius: 9999px;`) and small reason icon (`composer-reason-icon`) align cleanly to the bottom baseline.
- **Sticky Bottom & Safe Area**: Composer is anchored to the bottom of the viewport (`position: sticky; bottom: 0; z-index: 10`) with `padding-bottom: max(0.5rem, env(safe-area-inset-bottom))`, avoiding occlusion when the virtual mobile keyboard activates.
- **Keyboard Interaction Matrix**:
  - **Desktop**: Pressing `Enter` dispatches the message when sendable; `Shift+Enter` inserts a newline. While an IME composition is active (`e.nativeEvent.isComposing`), `Enter` dispatch is strictly ignored to prevent half-composed Korean input transmission.
  - **Mobile (`pointer: coarse` or `< 768px`)**: `Enter` inserts a newline without triggering dispatch, allowing mobile soft-keyboard multiline typing.
  - **Focus Preservation**: Focus is automatically retained in the textarea after message submission.
- **Dispatch Gating & Icon Tooltip**: Textarea remains continuously editable regardless of target status or connectivity. When sending is gated (`agent_busy`, `agent_blocked`, `no_agent_in_pane`, `target_not_found`, `connection_unavailable`, `response_capture_unavailable`), only the circular send button is disabled (`opacity: 0.35`). Gating rationale is conveyed via an accessible inline icon with native/aria tooltip (`title={err}`), eliminating noisy full-sentence banners from the input row.
- **Offline Guard**: If SSE stream connectivity is lost, only the send trigger is disabled with `connection_unavailable` while draft composition remains fully editable.

### 5. D1 Log & History Viewer (Scheduled for Milestone 0.3.2)
- Reserved tab view slot and layout specification for D1-backed turn logs.
- Milestone 0.3.1 implements the UI container, empty state, and keyword search input shell. Full persistence D1 query binding and scroll pagination are integrated in milestone 0.3.2 (#24).

### 6. Status Badges & Lucide Icon Pairing (`badge-status-*`)
Compact indicators pairing explicit labels, `aria-label`, and `lucide-react` icons (color is never used alone):
- `badge-status-idle`: Slate Gray outline with `Clock` icon and "Idle" label (Silver Gray in dark mode).
- `badge-status-done`: High-contrast `CheckCircle2` icon and "Done" label (Deep Slate fill with 1px `#A7A2A9` border and `#F4F7F5` text in dark mode).
- `badge-status-working`: Animated spinning `Loader2` icon with "Working" label (Silver Gray in dark mode; static icon under `prefers-reduced-motion`).
- `badge-status-blocked`: Deep Slate fill with `AlertTriangle` icon and "Blocked" label (1px `#A7A2A9` border and `#F4F7F5` text in dark mode).
- `badge-status-unknown`: Silver Gray / Slate Gray border with `HelpCircle` icon and "Unknown" label.
- **Connection Status Badge**: `Wifi` icon ("연결됨", green `#15803d`) and `WifiOff` icon ("연결 끊김", red `#b91c1c`) displayed in dashboard header.

### 7. SSE Event Streaming & Exponential Backoff Reconnection (Zero-Polling)
Real-time reactivity strictly follows the server SSE contract, banning periodic client-side polling:
- **`pane.updated` Event**: Delivers full snapshot payload `{ workspaceId, panes: PaneSummary[] }`. Panes cache is updated atomically.
- **`turn.updated` Event**: Delivers single turn state updates (`TimelineItem`). Upserts into the timeline stream without duplicating optimistic turns or regressing status ranks (allows `timeout` -> `completed` transition).
- **Exponential Backoff Reconnect & Fast Browser Recovery**:
  - `onerror`: Disables composer immediately with `connection_unavailable`. Client closes broken stream and schedules reconnection with exponential backoff (`baseMs=1000`, `factor=2`, `maxMs=30000` with jitter). Periodic polling loops remain strictly banned.
  - `online`, `visibilitychange` & `pageshow` (bfcache): When browser recovers network, tab gains focus, or page restores from mobile background bfcache (`pageshow` with `event.persisted`), client immediately clears backoff delay and attempts immediate reconnection (`reconnectNow()`).
  - `onopen`: Executed upon genuine connection establishment / re-connection. Triggers snapshot fetch `GET /api/workspaces/:wsId/panes` and synchronization of pending turns.
- **Safari / iOS Viewport & Touch Ergonomics**:
  - **Viewport Fit & Safe Area Insets**: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />` paired with `padding-top: max(1rem, env(safe-area-inset-top))` and composer `padding-bottom: max(0.5rem, env(safe-area-inset-bottom))`.
  - **Dynamic Viewport Unit**: Primary shell styled with `min-height: 100dvh` to absorb mobile browser address bar shifts.
  - **Auto-Zoom Prevention**: Input and textarea font size pinned to `16px` minimum to avoid iOS Safari viewport scaling on focus.
  - **Touch Target & Tap Feedback**: Interactive buttons, tabs, and panel items enforce minimum 44px touch targets (`min-height: 44px; min-width: 44px;`) with `-webkit-tap-highlight-color: transparent`. Top header action buttons (e.g., refresh `icon-btn`) employ borderless ghost styling while maintaining the 44px touch boundary to vertically harmonize with adjacent status badges.
  - **Dynamic Theme Color**: Dual `<meta name="theme-color">` for light (`#F4F7F5`) and dark (`#222823`) scheme transitions.
- **Scroll Positioning & Message Insertion UX**:
  - **Stick to Bottom**: When user is scrolled to the latest message (within 64px bottom threshold), incoming turn updates and SSE completion turns automatically trigger smooth auto-scrolling to the bottom (`behavior: 'auto'` if `prefers-reduced-motion` is active; `behavior: 'smooth'` otherwise).
  - **Scroll Lock on Reading**: If the user has scrolled up to inspect previous responses, incoming messages do not force-scroll the viewport; a floating pill ("새 메시지 도착 ↓") appears at the bottom.
  - **Optimistic Turn Dispatch**: Prompt submissions immediately append an optimistic turn (`queued` status with inline spinner) prior to POST resolution, eliminating latency perception.

### 8. Existing Components to shadcn/ui Mapping & Tailwind v4 @theme

#### Tailwind v4 `@theme` Architecture
Styling strictly adheres to Tailwind v4 CSS-first token declarations, unifying `--color-muted` to `#E2E6E3` to eliminate semantic collision and mapping semantic tokens via `@theme inline`:
```css
@theme {
  --color-primary: #08090A;
  --color-surface: #F4F7F5;
  --color-surface-dark: #222823;
  --color-secondary: #575A5E;
  --color-muted: #E2E6E3; /* surface-subtle */
  --color-canvas: #F4F7F5;
  --color-canvas-dark: #08090A;
  --color-border: #575A5E;
  --color-border-subtle: #A7A2A9;
  --font-headline-display: "Pretendard";
  --font-body-md: "Pretendard";
  --font-code-mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
}
```

#### Component Migration Matrix
Existing prototype components in `web/ui/` map directly onto standard shadcn/ui primitives:

| Existing Component | File Path | Target shadcn/ui Primitive | Implementation Specification |
| :--- | :--- | :--- | :--- |
| `PaneItem` | `web/ui/PaneItem.tsx` | `Card`, `Badge` | 2-row card layout: Row 1 houses primary title (`name`) & status `Badge` (right). Row 2 houses runtime (`agentKind`) & muted reason icon. Standard 64px card height. |
| `PanesView` | `web/ui/PanesView.tsx` | `Carousel` (Mobile) / Grid (Desktop) | Reuses `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`. Binds active snap to target pane. |
| `TimelineItemView` | `web/ui/TimelineItemView.tsx` | `Card`, `Badge`, `Alert` | Turn prompt and sanitized markdown response. Failures display shadcn `Alert` with `errorCode` (retry on pre-send only). |
| `MessageComposer` | `web/ui/MessageComposer.tsx` | `Textarea`, `Button`, `Alert` | Continuously editable textarea (CSS `resize: none`, fixed height with internal scrolling) with send button gating and explicit `disabledReason` in a shadcn `Alert`. (Turn reservation UI planned for 0.3.1). |
| `WorkspaceSection` | `web/ui/WorkspaceSection.tsx` | `Tabs`, `Sheet` | `TabsList` / `TabsTrigger` for mobile view switching; `Sheet` for off-canvas drawer settings. |

```yaml
components:
  panel-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  panel-card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  timeline-bubble:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  timeline-bubble-agent:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  composer-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
  composer-input-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
  composer-button-disabled:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
  composer-button-disabled-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.border-subtle}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.sm}"
  badge-status-idle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.status-idle}"
    borderColor: "{colors.status-idle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-idle-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.border-subtle}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-done:
    backgroundColor: "{colors.status-done}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-done-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-working:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.status-working}"
    borderColor: "{colors.border}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-working-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.border-subtle}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-blocked:
    backgroundColor: "{colors.status-blocked}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-blocked-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.canvas}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-unknown:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.status-unknown}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  badge-status-unknown-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.border-subtle}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  layout-canvas-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.canvas}"
  divider-border:
    backgroundColor: "{colors.border}"
  divider-border-subtle:
    backgroundColor: "{colors.border-subtle}"
```

## Motion & Transitions

### Motion Architecture
- **Standard CSS Transitions**: Default to lightweight CSS transitions (`transform`, `opacity` over `150ms-200ms ease-in-out`) for mobile drawer toggles, tab switching cross-fades, hover states, and input focus.
- **Carousel & Swipe Transitions**: Carousel slide translation operates via CSS transforms constrained within `200ms ease-out` with touch momentum dampening.
- **CSS Spinners**: Indeterminate progress spinners operate via CSS `@keyframes spin { to { transform: rotate(360deg); } }` at `800ms linear infinite`.
- **Motion Library Suggestion**: If complex gesture coordination or shared layout choreography is required across timeline updates, Framer Motion / Motion can be optionally integrated, keeping animations under 200ms.

### Reduced Motion & Gesture Accessibility
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
- **Reduced Motion Fallback**: When reduced motion is active, spinners switch to a static progress icon, drawers transition instantaneously without sliding animation, carousel slides jump directly to the target snap point (`transition: none`), tab views swap instantly, and chat timeline auto-scroll executes with `behavior: 'auto'` instead of smooth animated sliding.
- **Keyboard & Touch Accessibility**:
  - Carousel items and tabs support full keyboard focus with high-contrast outline rings (`focus-visible: ring-2 ring-ring`).
  - Tabs cycle via Left/Right arrows; Carousel items scroll via Left/Right arrows or standard swipe gestures.

## Do's and Don'ts

### Do's
- **Do** gate message dispatch strictly via `sendable` and `disabledReason` (7 deterministic reasons) rather than visual engine status alone.
- **Do** render all turn lifecycle states (including failed, timeout, and capture-unavailable turns) on the timeline with clear semantic badges and error callouts.
- **Do** allow retry actions **strictly for pre-send failures**; forbid re-dispatch on indeterminate failures (`delivery_uncertain`, `agent_prompt_stalled`, `timeout`).
- **Do** sanitize all agent markdown responses prior to timeline rendering to prevent XSS.
- **Do** use `ring-ring` (`= foreground`) for all interactive element focus rings to ensure WCAG non-text contrast compliance.
- **Do** maintain a minimum 3:1 non-text contrast ratio for all container borders, dividers, and dark badge boundaries across both light and dark themes.
- **Do** hydrate client state atomically from full SSE `pane.updated` snapshots and single `turn.updated` events without polling.
- **Do** recover state upon reconnection via the web REST endpoint `GET /api/workspaces/:wsId/panes`.
- **Do** use `shadcn Tabs` on mobile (`< md`) to switch cleanly between Panels, Chat, and History views to prevent excessive vertical scrolling.
- **Do** arrange panel cards horizontally in an Embla-backed `shadcn Carousel` on mobile viewports rather than stacking them vertically.
- **Do** reuse standard shadcn/ui primitives (`Tabs`, `Carousel`, `Card`, `Badge`, `Alert`) and avoid custom reinventions.
- **Do** ensure swipe gestures and keyboard arrow navigation work seamlessly across carousel and tab controls.
- **Do** disable the send action while keeping the textarea editable on SSE disconnection with `connection_unavailable`.
- **Do** visually separate agent identifiers from runtime tools (e.g., `opus` and `claude`) using typography and pill styling.
- **Do** move lengthy dispatch-disabled error descriptions out of the panel card list into dedicated composer callouts.
- **Do** use system monospace fonts for code and identifier elements.
- **Do** maintain fixed navigation on desktop (`>= md`) and a drawer on mobile (`< md`).
- **Do** provide `prefers-reduced-motion` fallbacks for all CSS animations, carousel slides, and tab transitions (setting `behavior: 'auto'` on auto-scroll).
- **Do** keep D1 persistence search and log pagination isolated to milestone 0.3.2 (#24).

### Don'ts
- **Don't** re-dispatch prompts on `delivery_uncertain`, `agent_prompt_stalled`, or `timeout`; require manual user evaluation.
- **Don't** execute periodic polling loops for pane lists or turn statuses; rely exclusively on SSE snapshots and onopen recovery.
- **Don't** swallow failed, timed out, or uncaptured turns silently from the timeline; omit intermediate scratchpad noise only.
- **Don't** place dark-on-dark badges or borders without 3:1 contrasting boundaries or high-contrast text.
- **Don't** list panel cards vertically down the page on mobile viewports; avoid inflating screen height with stacked cards.
- **Don't** re-implement custom slider, carousel, or tab components from scratch when shadcn provides them.
- **Don't** force animated sliding transitions or smooth scrolling when `prefers-reduced-motion` is enabled.
- **Don't** add arbitrary saturated colors for status indicators; derive tints and shades from the core neutral palette.
- **Don't** concatenate agent names with runtime tags directly without spacing or visual distinction.
- **Don't** clutter panel cards with long multiline error banners in the list overview.
- **Don't** render non-agent terminal panes or raw command-line executions in the workspace panel list.
- **Don't** claim universal contrast pass across all possible arbitrary element combinations; verify and validate explicit token-pair contrasts.
- **Don't** introduce multi-workspace pickers or auxiliary management views outside the designated Herdr workspace scope.
