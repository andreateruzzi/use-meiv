# Handover Document: Tandem Icon Development

**To:** Antigravity (or next assigned agent)
**Date:** May 20, 2026
**Project:** Meriolli Wedding Website
**Goal:** Deliver a truly professional, high-end "Tandem Bicycle" icon.

## Context
The user is building a highly polished, Vercel-hosted React application for a wedding. The core navigation concept is a "Tandem Journey": as the user navigates between sections, a tandem bicycle icon moves across the screen.

## The Problem
All previous attempts at generating the `TandemIcon.tsx` asset have failed the user's quality standards. 
- **Hand-coded SVGs (Rough.js/Canvas):** Described as "awful", "beheaded", and lacking proper details (e.g., missing handlebars, unrecognizable people).
- **External Lottie/Spline:** Failed due to 403 Forbidden errors or crashing the site.

## Your Mission
You must create a flawless, React-based SVG component (`src/components/TandemIcon.tsx`) of a tandem bicycle with two riders (a bride and groom). 

### Strict Requirements:
1.  **No External URLs:** Do not rely on fetching Lottie JSON files or Spline scenes from external URLs. They fail or crash. The asset MUST be embedded SVG code or a local JSON file if you can generate it.
2.  **Ultra-Professional Quality:** The SVG paths must be sophisticated. Do not use basic circles and stick figures for people. The silhouettes must be clearly human, elegant, and perfectly integrated with the bicycle.
3.  **Required Details:**
    - Distinct handlebars for both riders.
    - Wheels with visible, spinning spokes.
    - A clear distinction between the mechanical bike frame and the human riders.
4.  **Animation Integration:** The component must accept `isMoving` (boolean) and `direction` (number) props. It must integrate with `framer-motion` for the overall X-axis movement and include internal animations (spinning wheels, subtle bounce) when `isMoving` is true.

## Current Architecture
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (`src/components/TandemIcon.css`)
- **Animation Lib:** `framer-motion` is installed and preferred for the wrapper physics.

## Advice
Do not attempt to write complex bezier curves by hand if you cannot guarantee they will look like a professional Figma export. Your best approach is to generate a highly detailed, mathematically structured vector, or if you have access to specialized SVG generation tools, use them to create a perfect silhouette.