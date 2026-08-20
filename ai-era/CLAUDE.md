# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"AI纪元" (AI Era) is a static, single-page educational website consisting of 12 HTML articles that form a comprehensive Chinese-language series about Artificial Intelligence. The content spans from AI fundamentals (definitions, history, machine learning) to advanced topics (LLMs, AI Agents, Vibe Coding, AI Jailbreaking), plus a special article on the 1956 Dartmouth Conference. There is no build system, no framework, no tests — it's a collection of hand-crafted HTML files with inline CSS and JavaScript.

## Directory Structure

```
AI/
├── index-all.html          # Table of contents / landing page (12 cards linking to all articles)
├── index-all.css           # Landing page styles
├── styles.css              # Global/shared styles for all article pages (1270 lines, CSS variables, card components, typography)
├── scripts.js              # Shared JavaScript: scroll animations, nav highlight, smooth anchor scrolling
├── part1.html              # 序章: AI的定义与三大流派 (symbolic/connectionist/behaviorist)
├── part2.html              # 第1章: AI的前世今生 (interactive timeline 1936-2026, echarts waveform chart, particle canvas)
├── part3.html              # 第2章: 机器学习扫盲
├── part4.html              # 第3章: 深度学习扫盲
├── part4-llm.html          # 第4章: 大语言模型 (LLM deep-dive)
├── part5.html              # 第5章: 脉冲神经网络 SNN
├── part6.html              # 第6章: AI Agent扫盲
├── part7.html              # 第7章: AI Agent开发 (MCP, LangChain)
├── part8.html              # 第8章: Vibe Coding
├── part9.html              # 第9章: Harness
├── part10.html             # 第10章: AI越狱
├── dartmouth.html          # 特别篇: 1956达特茅斯会议
├── css/
│   └── learning-map.css    # (deprecated) old learning map styles
├── js/
│   └── learning-map.js     # (deprecated) old learning map script
└── source/                  # Images (images, icons)
```

## Architecture & Patterns

### Page Structure (every article page follows the same skeleton)

1. **`<head>`** — Chinese meta tags, Google Fonts (Noto Serif SC + Noto Sans SC + JetBrains Mono), `styles.css` (shared), then an optional page-specific `.css` file
2. **`<nav class="navbar">`** — Sticky top nav bar with logo link to `index-all.html` + 11 article links. Each page marks its own link with `class="active"`
3. **`<main class="main-content">`** — Article body
   - **Hero header**: `<header class="article-header">` with article number badge, title, meta info
   - **Sections**: `<section class="chapter-section fade-in">` containing content
4. **`<footer class="footer">`** — Simple copyright + prev/next links

### Shared CSS Components (defined in `styles.css`)

- `.word-card`, `.etymology-grid`, `.etymology-card` — for language/etymology content
- `.compare-container` / `.compare-column` — East vs West comparison layouts
- `.argument-card` — argument/explanation cards with colored top borders
- `.type-cards` / `.type-card` — AI type cards (ANI/AGI/ASI)
- `.routes-container` / `.route-card` — route/explanation cards
- `.streams-container` / `.stream-card` — AI school cards (symbolic/connectionist/behaviorist)
- `.summary-box` — highlighted summary callout
- `.conclusion-box` — centered conclusion text
- `.quote-block` — styled blockquote
- `.convergence-box` — convergence insight callout
- `.article-nav` — prev/next navigation buttons
- `.section-label` — decorative section headers

### Page-Specific CSS Files

Each article that has extra interactive elements or specialized layouts loads an additional `.css` file (naming convention: `partN.css` or `part4-llm.css`). These are **not** shared — they're tightly coupled to their page. Key unique features:

- **part2.css**: Timeline layout with alternating left/right nodes, phase separators, dartmouth expansion cards, echarts chart container, particle canvas styles, AI winter chart styles, scientist cards
- **part4-llm.css**: Dense vs MoE comparison cards, SVG visualizations, inference flow steps, tech grids, topic lists, term grids, definition grids, scene grids, formula boxes, algo section cards, code styling

### Interactivity

- **`scripts.js`**: IntersectionObserver scroll animations, active nav highlighting, smooth anchor scrolling
- **part2.html**: Embedded inline JS for particle canvas background + ECharts heatmap waveform chart (AI popularity over time). No external dependencies besides ECharts CDN.
- Each page-specific CSS file may have associated inline `<script>` blocks

### Design System

- **Color palette**: Warm coral (`--primary-hue: 16`), warm gold accent, warm beige backgrounds, muted text tones
- **Typography**: Noto Serif SC for headings, Noto Sans SC for body, JetBrains Mono for code/technical
- **Responsive**: Single `@media (max-width: 768px)` breakpoint in `styles.css` that collapses grids to single column
- **Print styles**: Navigation, article nav, and footer hidden when printing

## Working With This Project

### Viewing pages

Open any `.html` file directly in a browser (no server required). For best results, open `index-all.html` as the entry point.

### Adding a new article or modifying content

1. Copy an existing article's structure (head/nav/main/footer skeleton)
2. Update the `<title>`, article number, and content
3. Ensure the nav bar has the correct `class="active"` on the new page
4. Add a card entry to `index-all.html`'s `<div class="grid">`
5. If the page needs specialized styles, create `partN.css` and reference it in `<head>`

### Creating page-specific CSS

- If the page uses only shared components from `styles.css`, no additional CSS needed
- If you need custom layouts/components, create a `partN.css` file and follow the pattern: define scoped overrides without breaking `styles.css` variables
- The part4-llm.css shows the pattern for complex technical content: `algo-section-card`, `tech-grid`, `tech-card`, `def-grid`, `def-card`, `viz-card`, `viz-svg-container`, `scene-grid`, `scene-card`, `inference-flow`, `flow-steps`, `stage-timeline`, `stage-item`, `topic-list`, `term-grid`, `term-item`, `two-col`

### Navigation updates

When adding/removing pages, remember to update:

1. The nav bar (`<nav class="navbar">` in all articles)
2. The card grid in `index-all.html`
3. The footer prev/next links in adjacent articles

### Images

All images are in the `source/` directory. References to images appear as inline `<img>` tags with paths like `source/达特会议.webp`.

## Key Conventions

- All content is in Chinese (zh-CN)
- No build tools, no package managers, no test framework
- CSS is written inline in stylesheets — no CSS-in-JS, no preprocessors
- JavaScript is minimal and embedded either in `scripts.js` or inline `<script>` blocks
- All files are standalone — no templating engine or server-side processing needed
- The site is designed to be deployed as static files (e.g., via GitHub Pages, Netlify drop, or any static host)

如果你要启动服务，请不要占用8080端口，可以使用8011端口
