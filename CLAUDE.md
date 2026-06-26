# CLAUDE.md

This file gives Claude Code the context it needs to work in this repo. Keep it short and high-signal — Claude reads it at the start of every session, so prune anything that goes stale.

## Project overview

<!-- FILL IN: one or two sentences on what this site is and who it's for.
     Example: "A landing page for a local coffee shop showing the menu,
     hours, and location. Static, no user accounts." -->

A frontend-only website built with plain HTML, CSS, and JavaScript. No framework, no backend, no build step.

## Design bar

This site should feel deliberately designed, not templated. Hold every screen to these standards:

1. **A point of view.** Commit to one clear design direction (editorial, brutalist, dark-luxury, retro-modern, etc.) and execute it consistently. Avoid the generic default look.
2. **Typography that works.** Pair a display face with a body face — and avoid Inter and Roboto. Let scale and weight carry hierarchy so headlines feel chosen, not defaulted.
3. **A restrained palette.** Three to five colors, used consistently. No rainbow palettes — premium reads through restraint.
4. **Hierarchy that breathes.** Use whitespace, scale, and contrast to guide the eye. Every view needs a clear primary / secondary / tertiary, never a flat wall of content.
5. **Imagery with intent.** No obvious stock photos. Use custom, art-direction-matched, or tightly curated images so they feel commissioned.
6. **Motion that whispers.** Subtle, hand-crafted micro-interactions and scroll behavior. Avoid generic library "fade-up" effects.
7. **Mobile that's designed, not shrunk.** Make real layout decisions for phone — don't just compress the desktop version. (This is where most cheap sites collapse.)
8. **The invisible fundamentals.** Sub-2s load, WCAG AA contrast, keyboard navigation, semantic HTML, and real meta tags. Users don't see these directly, but they feel that the site is fast and works.

## Tech stack

- **HTML5** — semantic markup
- **CSS** — vanilla CSS (no preprocessor)
- **JavaScript** — vanilla ES6+, no framework or bundler
- No backend, no database — everything runs client-side in the browser

## Project structure

```
.
├── index.html          # Entry point
├── css/
│   └── styles.css      # Global styles
├── js/
│   └── main.js         # Page logic
└── assets/             # Images, fonts, icons
```

Keep this tree accurate as the project grows — Claude relies on it to navigate.

## Running locally

There's no build step. Serve the folder with any static server:

```bash
# Python (already on macOS)
python3 -m http.server 8000

# or Node
npx serve
```

Then open http://localhost:8000.

## Conventions

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) instead of generic `<div>`s where it makes sense.
- CSS class names: lowercase and hyphenated (e.g. `.hero-banner`, `.nav-link`).
- Use CSS custom properties (variables) for colors, spacing, and fonts so they're changeable in one place.
- Modern vanilla JS only: `const`/`let`, arrow functions, `addEventListener`. No jQuery.
- Keep functions small and clearly named; one concern per file where practical.

## Guardrails

- Don't add frameworks, build tools, or npm dependencies without asking first — this project is meant to stay simple and dependency-free.
- Don't introduce a backend or external API calls unless I ask.
- Verify changes render correctly in the browser before calling them done.
- When a design or structure decision is ambiguous, ask rather than guessing.

## Working with me

- I'm still learning, so briefly explain the *why* behind non-obvious changes.
- Prefer clear, conventional approaches over clever ones.
