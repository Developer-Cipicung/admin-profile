# Frontend Architecture

This document describes the architectural philosophy and structural design of the `admin-profile` React application.

## Core Principles

1. **Build When Needed**: Do not generate components, hooks, or pages that are not immediately required by a feature. We avoid premature abstractions to keep the codebase lean and understandable.
2. **Mobile-First Design**: The interface is designed primarily for mobile viewport constraints, specifically targeting performance on low-end smartphones. Desktop layouts are progressively enhanced using Tailwind's `lg:` breakpoint prefix.
3. **Strict Separation of Concerns**: 
   - **UI Components** are purely presentational and remain ignorant of data-fetching logic.
   - **Hooks** encapsulate all business logic, state management, and side effects.
   - **Services** are strictly responsible for network requests and backend data contracts.

## Directory Structure

```text
src/
├── components/   # Presentational React components (UI)
│   ├── common/   # Reusable UI elements (Button, Card, Input)
│   ├── form/     # Form-specific components
│   └── news/     # Domain-specific components (e.g. NewsTable, NewsCard)
├── constants/    # Global constants (e.g. pagination sizes, debounce delays)
├── contexts/     # React Context providers (AuthContext)
├── hooks/        # Custom React hooks (useNews, useDebounce)
├── layouts/      # Structural layout wrappers (DashboardLayout, AuthLayout)
├── pages/        # Top-level page components routing to features
├── routes/       # React Router v7 configuration and ProtectedRoute logic
├── services/     # API request abstractions (api.js, auth.service.js)
└── utils/        # Stateless utility functions (token.js, date.js, queryParams.js)
```

## Data Flow Example (News Module)

1. The User accesses `/news`.
2. `routes/index.jsx` renders `pages/news/NewsPage.jsx`.
3. `NewsPage.jsx` calls the `hooks/useNews.js` custom hook.
4. `useNews.js` manages local state (`loading`, `data`, `error`) and invokes `services/news.service.js`.
5. `news.service.js` parses parameters via `utils/queryParams.js` and calls the global `api.get()`.
6. Data flows back up to `useNews.js`, which triggers a re-render.
7. `NewsPage.jsx` passes the raw data to purely presentational components (`NewsTable.jsx`, `NewsCard.jsx`).

## Advanced Patterns

### Population History Filter Lifecycle (URL Synchronization)
To ensure shareability and persistence upon refresh, filter states (e.g., Year, Month, Source ID, Pagination) in the Population History page are managed via the URL using `useSearchParams`:
1. Dropdown interactions update the browser URL parameters.
2. Changes to URL parameters trigger a `useEffect` inside `PopulationHistoryPage`.
3. This effect fetches updated data arrays (`fetchHistory`, `fetchTrends`) based directly on the URL state.
4. A separate `/filters` endpoint supplies dynamically grouped configurations, automatically displaying the precise number of snapshots available for any given year.

### Export Service Contract
All export formats are tightly governed by `populationExport.service.js` which strictly defines expected inputs (query filters) and required outputs (CSV/Excel/PDF buffer streams) for future integrations, respecting SOLID dependency segregation rules.
