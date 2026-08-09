# Implementation Plan: "Tandem Journey" Navigation

## Goal Description
The core user requirement defined in the project guidelines for the navigation concept is the **Tandem Journey**:
> "Il sito si sviluppa come un percorso ("route"). Transizioni orizzontali tra le sezioni: la sezione corrente scorre a sinistra, quella nuova appare da destra. Icona animata: un tandem nero con gli sposi (stile icona) che si muove tra le sezioni durante la transizione. Trigger: Una freccia grigia semi-visibile sul lato destro dello schermo per avanzare nel percorso."

Currently, the site is using a standard `VerticalLayout` component (`flex-direction: column`). This plan outlines the architectural shift to a true horizontal journey layout, matching the luxurious and dynamic aesthetic of the site.

## User Review Required

> [!WARNING]
> This is a major structural change. It will convert the website from a single scrolling page to a "slide-by-slide" horizontal presentation. 
> - **Scrolling Behavior:** Vertical scrolling will still be possible *inside* tall sections (like the RSVP form or Gallery), but to move to the *next* section, the user will use the right-arrow trigger or swipe horizontally on mobile.

## Open Questions

> [!IMPORTANT]
> 1. **Tandem Icon:** I will generate or source a sleek, minimalist SVG icon of a tandem bicycle. Where should it be positioned? (e.g., fixed at the bottom center of the screen, or moving along a horizontal line in the lower third?)
> 2. **Mobile UX:** On mobile, should we allow users to simply swipe left/right to change sections in addition to the arrow button? (Highly recommended for modern UX).

## Proposed Changes

### Core Layout Component

#### [NEW] src/components/TandemLayout/TandemLayout.tsx
#### [NEW] src/components/TandemLayout/TandemLayout.css
A new layout component that will wrap all sections.
- It will hold a state variable `currentSection` (0 to N).
- It will render a horizontal flex container with `width: N * 100vw`.
- It will use a smooth CSS transition on `transform: translateX(...)` to slide sections.
- It will feature the **Arrow Trigger** fixed on the right side of the viewport.
- It will render the **Tandem Icon** and animate it during transitions (e.g., moving forward, dipping slightly to simulate pedaling or journeying).

### App Routing Integration

#### [MODIFY] src/App.tsx
Replace instances of `<VerticalLayout>` with `<TandemLayout>`.

### Asset Generation

#### [NEW] src/assets/tandem-icon.svg
I will create a minimalist black tandem SVG to act as the animated icon between transitions.

### CSS Refactoring

#### [MODIFY] src/index.css
Add global classes to ensure `body` and `html` do not overflow horizontally, maintaining the strictly controlled horizontal slide view.

## Verification Plan

### Manual Verification
1. I will implement the component and replace the layout.
2. I will verify that clicking the right arrow smoothly transitions the screen horizontally.
3. I will verify the tandem icon animates correctly during the transition.
4. I will test mobile responsiveness to ensure tall components (like RSVP) can still be scrolled vertically without breaking the horizontal layout.
