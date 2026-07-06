# API Integration

This document outlines how the frontend communicates with the backend `profile-api`.

## Global API Wrapper (`api.js`)

Instead of calling `fetch()` directly in every service, all HTTP communication goes through a centralized wrapper at `src/services/api.js`.

### Responsibilities:
1. **Base URL Resolution**: Automatically prepends the `VITE_API_URL` to all endpoints.
2. **Token Injection**: Automatically retrieves the `admin_access_token` and injects it into the `Authorization: Bearer <token>` header if available.
3. **Response Parsing**: Automatically parses standard JSON responses.
4. **Error Handling**: Detects HTTP `401` errors and throws a custom `UnauthorizedError` class. Rejects promises with clear string messages derived from backend error payloads for all other errors.

## Constructing Queries (`queryParams.js`)

To prevent messy string concatenation and unescaped characters, the frontend uses `src/utils/queryParams.js`.

The `createQueryString(params)` utility accepts a JavaScript object (e.g. `{ page: 1, limit: 12, search: 'hello' }`), automatically strips out `null` or `undefined` values, and converts it into a safe, URL-encoded query string (`page=1&limit=12&search=hello`).

## Service Layer

Services (like `src/services/news.service.js`) act as the bridge between the UI logic (Hooks) and the API Wrapper.

- They do **not** contain UI state (no `useState` or `useEffect`).
- They strictly adhere to the contracts established in the `profile-api/docs/`.
- Example:
  ```javascript
  export const newsService = {
    getNews: async (params) => {
      const queryString = createQueryString(params);
      return api.get(queryString ? `/news?${queryString}` : '/news');
    },
  };
  ```
