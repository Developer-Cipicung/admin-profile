# UI & Components Architecture

This document describes the design language, styling strategy, and component hierarchy of the frontend.

## Styling (Tailwind CSS)

All styling is achieved using **Tailwind CSS** utility classes. We avoid custom CSS files (outside of the base `index.css` directives) to ensure rapid development and style consistency.

### Responsive Strategy (Mobile-First)
The UI defaults to mobile styling. Desktop styles are applied using the `sm:`, `md:`, and `lg:` prefixes.

A core pattern in this application (e.g., in the News Module) is conditional rendering purely via CSS:
- **Desktop Table**: Uses `hidden lg:block` to hide on small screens and display on large screens.
- **Mobile Cards**: Uses `lg:hidden` to display on small screens and hide on large screens.
- *Why?* This avoids expensive JavaScript `window.resize` event listeners and keeps the DOM fast.

## Component Hierarchy

Components are divided into two distinct categories:

### 1. Common Components (`src/components/common/`)
Highly reusable, generic UI elements that contain no domain-specific knowledge.
- **Button.jsx**: Standardized buttons with primary/secondary/danger variants and loading states.
- **Card.jsx**: Generic card containers.
- **Input.jsx**: Form inputs.
- **RefreshButton.jsx**: A standard refresh action button.

### 2. Domain Components (`src/components/news/`)
Components built for a specific business purpose. These components orchestrate the common components but remain *presentational* (they accept data via props, but do not fetch data themselves).
- **NewsTable.jsx**: A specialized table strictly for displaying News data.
- **NewsSearch.jsx**: A specialized search input.
