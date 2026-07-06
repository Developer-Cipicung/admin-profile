# Authentication Flow

This document details the authentication and authorization mechanism implemented in the Administrator Dashboard.

## Mechanism

The application utilizes **Stateless JWT (JSON Web Token) Authentication**.
- **Token Storage**: The JWT is persisted in `localStorage` under the key `admin_access_token` to survive browser refreshes.
- **Source of Truth**: The frontend relies entirely on the backend to validate tokens. The frontend **does not** decode the JWT to check expiration or extract user data.

## 1. Login Flow

1. The user submits credentials via `LoginPage.jsx` (handled by `react-hook-form`).
2. The `AuthContext` calls `authService.login()`, sending a `POST /api/v1/auth/login` request.
3. Upon success, the backend returns an `accessToken` and an `admin` object.
4. The token is saved via `utils/token.js`.
5. The `AuthContext` updates its internal state (`isAuthenticated = true`, `admin = data`) and redirects the user to `/dashboard`.

## 2. Protected Routes

Access control is governed by `routes/ProtectedRoute.jsx`.

- If the application is initially loading (checking for a token), a `LoadingSpinner` is displayed.
- If `isAuthenticated` is `false`, the user is forcefully redirected to `/login` via `<Navigate replace />`.
- If authenticated, the `Outlet` (nested routes) is rendered.

## 3. The 401 Unauthorized Interceptor

Because the frontend does not decode tokens, it discovers an expired or invalid token only when making an API request.

1. **Global Interceptor**: Every API request passes through `services/api.js`. If the backend returns HTTP Status `401 Unauthorized`, `api.js` explicitly throws an `UnauthorizedError`.
2. **Hook Level Catching**: Custom hooks (like `useNews.js`) catch this error in their `try/catch` blocks.
3. **Immediate Logout**: If the caught error is an instance of `UnauthorizedError`, the hook immediately invokes `logout()` (provided by `AuthContext`), clearing the token and returning the user to the login screen.

> [!CAUTION]
> Asynchronous errors (inside `useEffect` or `fetch`) are not caught by standard React `ErrorBoundary` components. Thus, hooks must manually intercept `UnauthorizedError` and trigger the context `logout()`.
