# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run preview  # Preview production build
```

No test or lint commands are configured.

## Architecture

React 19 + TypeScript SPA built with Vite. React Router DOM v7 handles routing. Tailwind CSS is loaded via CDN (configured inline in `index.html` — not via a config file). No backend.

### Routing & Layout

`App.tsx` defines all routes and renders the shared layout (header + bottom dock navigation). Routes map to page components in `/pages/`.

### Content Management

**Blog posts** are hardcoded as a `BlogPost[]` array in `constants.tsx`. To add a blog post, add an entry there.

**Case studies / projects** use a two-part system:
1. Project metadata (id, title, tags, etc.) lives in the `PROJECTS` array in `constants.tsx`
2. The actual case study content is a Markdown file in `/public/case-studies/<id>.md`, fetched at runtime in `CaseStudy.tsx` via `fetch()`

The `id` field in `PROJECTS` must match the filename (without `.md`) in `/public/case-studies/`.

### Markdown Rendering

`CaseStudy.tsx` renders Markdown using `react-markdown` with `remark-gfm`. Code blocks with `language-mermaid` are intercepted and rendered by the custom `src/components/Mermaid.tsx` component (using the Mermaid v11 library).

### Styling

- Colors and fonts configured in a `<script>` Tailwind config block inside `index.html`
- Key custom colors: `primary` (#137fec), `background` (#0a0f14), `card` (#111820)
- Material Symbols Outlined icons loaded from Google Fonts CDN

### Environment

The app uses a `GEMINI_API_KEY` environment variable (set in `.env.local`), exposed via Vite's `define` config in `vite.config.ts`.
