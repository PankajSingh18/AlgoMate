# AlgoBuddy Design System & UI Specification

## 1. Context and Goals
This document serves as the implementation-ready, token-driven UI/UX guidance for the **AlgoBuddy** platform. The design system is optimized for learning efficiency, high visual aesthetics (glassmorphism, smooth animations, and dual-theme slate-purple styling), and strict accessibility (WCAG 2.2 AA). It defines the design vocabulary across all key modules: the Algorithm Visualizer, Practice Arena, AlgoBot AI Chatbot, and Floating Algorithm Notebook.

---

## 2. Design Tokens and Foundations

### 2.1 Color Palette
AlgoBuddy uses a curated, harmonious color system tailored for long coding sessions. Solid fills, border opacities, and light/dark theme variables are strictly mapped to CSS tokens.

#### Brand Colors
*   **Primary Purple (Base)**: `#a435f0` (Used for active buttons, brand logo accents, progress lines, and focused states)
*   **Primary Purple (Hover/Dark)**: `#8f2cd6` (Used for hover states on primary components)
*   **Purple Accent (Light Fills)**: `rgba(164, 53, 240, 0.08)` / `rgba(164, 53, 240, 0.1)` (Used for badges, sidebar selected states, and background card tint overlays)
*   **Purple Accent (Border)**: `rgba(164, 53, 240, 0.2)`

#### Light Mode Tokens
*   `color.bg.base`: `#f8fafc` (Slate 50 - Main background fill)
*   `color.bg.surface`: `#ffffff` (White - Card, panel, and sidebar background)
*   `color.bg.header`: `rgba(255, 255, 255, 0.85)` (Glassmorphic header fill)
*   `color.text.primary`: `#0f172a` (Slate 900 - High contrast text)
*   `color.text.secondary`: `#475569` (Slate 600 - Secondary paragraphs)
*   `color.text.muted`: `#94a3b8` (Slate 400 - Timestamps, place holders)
*   `color.border.default`: `#f1f5f9` (Slate 100 - Border delimiters)
*   `color.border.strong`: `#e2e8f0` (Slate 200 - Input/interactive borders)

#### Dark Mode Tokens
*   `color.bg.base`: `#0f0f12` (Main dark grey background)
*   `color.bg.surface`: `#1c1d21` (Neutral 900 equivalent - Panel base background)
*   `color.bg.header`: `rgba(28, 29, 33, 0.85)` (Dark glassmorphic header fill)
*   `color.text.primary`: `#f8fafc` (Slate 50 - High contrast text)
*   `color.text.secondary`: `#cbd5e1` (Slate 300 - Standard paragraphs)
*   `color.text.muted`: `#64748b` (Slate 500 - Timestamps, placeholder text)
*   `color.border.default`: `#2d2f34` (Neutral 800 - Border delimiters)
*   `color.border.strong`: `#3e4147` (Neutral 700 - Input/interactive borders)

#### Status Colors (Shared)
*   **Success (Easy / Solved)**: `#22c55e` (Emerald 500) | Accent: `rgba(34, 197, 94, 0.1)`
*   **Warning (Medium / Attempted)**: `#f59e0b` (Amber 500) | Accent: `rgba(245, 158, 11, 0.1)`
*   **Danger (Hard / Error)**: `#ef4444` (Red 500) | Accent: `rgba(239, 68, 68, 0.1)`

---

### 2.2 Typography Scale
All typography uses clean fonts loaded dynamically (e.g. Google Fonts) with precise sizing scales.

*   **Primary Typeface**: `Inter`, `Outfit`, `Source Sans 3`, sans-serif (For user interfaces, inputs, and menus)
*   **Headings Typeface (Editorial)**: `Source Serif 4`, `Source Serif Pro`, Georgia, serif (For landing page hero sections and marketing cards)
*   **Monospace Typeface**: `Fira Code`, `JetBrains Mono`, SFMono-Regular, Consolas, monospace (For code playback and input textareas)

#### Font Sizes & Line Heights
*   `font.size.xs`: `11px` / `12px` (LH: `16px`) - Badge numbers, dates, tags, metadata
*   `font.size.sm`: `13px` (LH: `18px`) - Sub-labels, search inputs, secondary interface text
*   `font.size.base`: `14px` (LH: `20px`) - Main body copy, button labels, list items
*   `font.size.lg`: `16px` (LH: `24px`) - Section headings, markdown body reading text
*   `font.size.xl`: `18px` (LH: `26px`) - Cards headings, smaller layout title banners
*   `font.size.2xl`: `24px` (LH: `32px`) - Page dashboard titles, main banners
*   `font.size.3xl`: `36px` (LH: `44px`) - Modal and marketing headings
*   `font.size.4xl`: `48px` (LH: `56px`) - Main landing Hero headlines

---

### 2.3 Spacing Scale
Layout offsets must strictly adhere to the 4px grid.
*   `space.1`: `4px` (`0.25rem`)
*   `space.2`: `8px` (`0.5rem`)
*   `space.3`: `12px` (`0.75rem`)
*   `space.4`: `16px` (`1rem`)
*   `space.5`: `20px` (`1.25rem`)
*   `space.6`: `24px` (`1.5rem`)
*   `space.8`: `32px` (`2rem`)
*   `space.12`: `48px` (`3rem`)

---

### 2.4 Border Radius, Elevation & Motion
*   `radius.xs`: `6px` / `8px` (Inside buttons, search fields, toolbar utilities)
*   `radius.sm`: `12px` (Sidebar items, active list nodes, dropdown select panels)
*   `radius.md`: `16px` (Default cards, chatbot input boxes, dialog action panels)
*   `radius.lg`: `24px` (Major outer wrappers, dashboard sections, floating widgets)
*   `radius.xl`: `32px` (Banners, main dashboard panels, landing visual sections)
*   `radius.full`: `9999px` (Pills, circular button controls, avatars, scroll-to-top)
*   `shadow.sm`: `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` (Light boundaries)
*   `shadow.md`: `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px` (Card lift)
*   `shadow.lg`: `rgba(0, 0, 0, 0.15) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -2px` (Dropdowns, floating buttons)
*   `shadow.2xl`: `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` (Modals, Chat panels, Notebook widgets)
*   `motion.duration.instant`: `150ms` (Color transitions, minor opacity shifts)
*   `motion.duration.fast`: `200ms` (Scale hover states, spring offsets)
*   `motion.duration.normal`: `250ms` (Side panels sliding, modal fades)
*   `motion.duration.slow`: `300ms` (Scroll triggers, complex sidebar transitions)
*   `motion.ease`: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 3. Component-Level Rules

### 3.1 Global Navigation Bar (Navbar)
*   **Anatomy**: Logo link, menu links, notifications bell, user profile avatar with dropdown trigger, and light/dark theme switch.
*   **Anatomy Rules**:
    *   Height must be locked at `72px`.
    *   Base background must be glassmorphic (`backdrop-blur-md` with `bg-white/85` in light mode and `bg-neutral-900/80` in dark mode).
    *   Underline indicators under links must use `bg-primary` and transition on hover or selection.
*   **Responsive Rules**:
    *   On desktop (`md` and up), show flat link list.
    *   On mobile (below `md`), show mobile toggle button which reveals a full-page drawer sliding down. Prevents background scroll when open.

---

### 3.2 Practice Arena Dashboard
*   **PracticeSessionBanner**:
    *   Must be styled as a raised dashboard card using a clean border outline.
    *   Contains "Back to All Sessions" link at the top-left, pointing to `/visualizer`.
    *   Action area contains `Start Practice` (solid primary fill) and `Group Study` (bordered outline).
    *   *Constraint*: No bookmark triggers inside this top banner wrapper.
*   **PracticeRightSidebar (Session Progress)**:
    *   Circular progress ring must use `#a435f0` for active progress and a faint opacity fill for background.
    *   The percentage text (e.g. `49%`) must use `text-base font-black` (14px) to remain perfectly contained inside the progress ring without overlapping boundaries.
*   **Filters & Tables**:
    *   Search bar must have a minimum height of `44px` with a placeholder text and `Search` icon positioned on the left at `left-4`.
    *   Pagination controls must be clearly bounded and show "Showing X to Y of Z problems" indicator.
    *   Row states:
        *   Default: Standard background border.
        *   Hover: Shift background to light grey overlay (`bg-slate-50/20` / `hover:bg-neutral-800/10`) and apply focus outline to active elements.

---

### 3.3 Floating AI Chatbot (AlgoBot)
*   **Anatomy**: Floating toggle button, floating chat panel.
*   **Trigger Button**:
    *   Anchored at `fixed bottom-3 right-3 sm:bottom-6 sm:right-6` (Z-index: `10000`).
    *   Size is locked to `w-14 h-14` with a `rounded-2xl` border-radius and `bg-primary` solid fill.
    *   Contains the customized `AlgoBotIcon`.
*   **Chat Panel**:
    *   Floating position: `bottom-[80px] sm:bottom-[92px] right-4 sm:right-6` (Z-index: `10000`).
    *   Desktop width is `400px`, height `600px` (or `max-h-[calc(100vh-120px)]`).
    *   Mobile width is full screen width minus padding (`w-[calc(100vw-32px)]`).
    *   Message blocks:
        *   User message: Solid `bg-primary` with white text, aligned to the right.
        *   Assistant message: Light grey card with black/white text, aligned to the left. Supports full markdown rendering, syntax-highlighted code segments, tables, and blockquotes.

---

### 3.4 Floating Algorithm Notebook (FloatingNotesAssistant)
*   **Anatomy**: Floating toggle button (shares style of Chatbot button), dual-pane notes panel.
*   **Trigger Button**:
    *   Positioned above or below other components in a stacked vertical alignment:
        *   When scrolled: `bottom-36 right-3 sm:bottom-44 sm:right-6` (above BackToTop).
        *   When not scrolled: `bottom-20 right-3 sm:bottom-24 sm:right-6` (directly above Chatbot).
*   **Dashboard Panel**:
    *   Fixed side-by-side positioning next to the floating button stack:
        *   Desktop: `bottom-[92px] right-[88px] left-auto w-[540px] h-[450px]` (Z-index: `9999`). This keeps the right button stack fully visible and prevents viewport clipping.
        *   Mobile: `bottom-[80px] left-4 right-4 w-[calc(100vw-32px)] h-[400px]` (centered).
    *   Left Sidebar (Note management):
        *   Width is locked to `w-[110px] sm:w-[190px]` (Z-index: `9999`).
        *   Contains: `+ New Note` button, search bar (icon left, 28px left padding on input), and filtered scrollable list.
    *   Right Pane (Workspace):
        *   Header with note title input, category selector dropdown, and `Write` / `Preview` mode toggles.
        *   Preview mode renders notes through an automatic preprocessor.
            *   *Preprocessor rule*: Resolves headers missing a space (e.g. `#hello` -> `# hello`) before parsing.
            *   *Whitespace rule*: Preserves single line breaks inside paragraph/list elements using `whitespace-pre-wrap` styling inside leaf nodes, but ignores it on the main wrapper container to avoid large block spacing gaps.

---

## 4. Accessibility Requirements (WCAG 2.2 AA)

*   **Keyboard Accessibility**:
    *   Every interactive component (buttons, inputs, select menus, note items) must be keyboard tabbable (`tabindex="0"`).
    *   Focus states must display a distinct visual outline (`focus-visible:ring-2 focus-visible:ring-primary`). Never hide focus outline unless replacement visual styling is applied.
*   **Touch Targeting**:
    *   All floating buttons and list action items must have a minimum touch target size of `44px x 44px` on mobile layouts.
*   **Color Contrast**:
    *   All visual text elements (except icons used purely for aesthetics) must adhere to a contrast ratio of at least 4.5:1 against their backgrounds (3:1 for large text).
*   **Aria Labels**:
    *   Floating buttons must have descriptive `aria-label` properties (e.g. `aria-label="Algorithm Notebook"`, `aria-label="Close Chatbot"`).
    *   Icon buttons (e.g., Delete, Copy, Download) must contain descriptive `title` attributes.

---

## 5. Content and Tone Standards
*   **Tone**: Concise, helpful, developer-friendly, and confident.
*   **Code Block Writing Rules**: Code blocks in previews or chatbot replies must specify the programming language (e.g. `javascript`, `python`) to enable syntax highlighting.
*   **Formatting Rules**:
    *   Use bold (`**text**`) for focus keywords, DSA concepts, and time complexity metrics (e.g., **O(N log N)**).
    *   Provide direct, bulleted checklists for instructions.

---

## 6. Anti-Patterns & Prohibited Implementations
*   **Visual overlap**: Do not place the notebook dashboard directly above the trigger button on desktop (causes layout blocking on screens with heights under 760px). Anchor it side-by-side (`right-[88px]`).
*   **Hardcoded hexadecimal values**: Do not apply custom colors inline in JSX. Use Tailwind variables (`text-primary`, `bg-slate-50`, `dark:bg-neutral-900`) to guarantee light/dark mode consistency.
*   **Soft breaks collapsing**: Do not let single newlines collapse into a single line in markdown previews. Ensure `whitespace-pre-wrap` is applied to individual `<p>` and `<li>` components.
*   **Empty lists**: Do not leave sidebars empty when no notes or bookmarks are found. Render a structured, stylized empty state with a call to action.

---

## 7. Design QA Checklist
- [ ] Do all floating panels (`FloatingNotesAssistant`, `Chatbot`) fit on a standard 700px height laptop viewport without clipping the header?
- [ ] Does the floating Notes panel stay to the left of the button stack on desktop, leaving buttons accessible?
- [ ] Does pressing `Tab` focus on all note sidebar items, search inputs, and formatting toolbar buttons?
- [ ] Is there a visible `ring-2` focus border when navigating elements via keyboard?
- [ ] Are single line breaks in notes preserved correctly in the preview panel?
- [ ] Do headers without spaces (e.g. `#hello`) automatically format and render as visual headings in the preview?
- [ ] Does the linter pass with 0 warnings or errors after styling modifications?
