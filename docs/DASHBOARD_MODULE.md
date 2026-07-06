# Dashboard Module Documentation

The Dashboard acts as the primary landing page immediately following successful administrative authentication.

## Features Implemented

### 1. Statistical Overview
- **Data Aggregation:** Because the backend API does not currently expose a dedicated, aggregated `/api/v1/dashboard/summary` endpoint, the Dashboard safely extracts metrics from the robust pagination data provided by our existing endpoints.
- **Hook Reuse:** The page silently invokes the generic `useNews()`, `useProducts()`, and `useAdministrators()` hooks in parallel.
- **Data Binding:** It extracts the `pagination.totalItems` value emitted by each hook to calculate exact catalog sizes in real-time.
- **Progressive Loading:** If any specific endpoint lags during the initial mount sequence, its specific numeric counter gently displays a sleek grey `animate-pulse` placeholder until the data arrives.

## Architectural Notes
- **Extensibility:** If a real `/summary` API route is deployed in the future, the three redundant hook invocations can be safely deleted and replaced with a single `useDashboardSummary()` network fetch without changing the underlying `Card` markup structure.
