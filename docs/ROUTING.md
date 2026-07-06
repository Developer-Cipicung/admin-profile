# Routing Architecture

The application utilizes **React Router v7** for declarative, component-based routing. The routing logic is centralized in `src/routes/index.jsx`.

## Route Hierarchy

Routes are categorized into two primary trees: **Public (Auth)** and **Protected (Dashboard)**.

```mermaid
graph TD
    App[AppRoutes] --> Redirect[/ --> /login]
    App --> AuthLayout
    App --> ProtectedRoute
    App --> NotFound[/*]
    
    AuthLayout --> Login[/login]
    
    ProtectedRoute --> DashboardLayout
    
    DashboardLayout --> Dashboard[/dashboard]
    DashboardLayout --> News[/news]
    DashboardLayout --> Products[/products]
    DashboardLayout --> Admins[/administrators]
```

## Layouts

Layouts are wrapper components that provide persistent UI elements (like sidebars and navigation headers) while rendering child routes using the `<Outlet />` component.

1. **`AuthLayout.jsx`**: A minimal wrapper designed for authentication pages (Login). It centers the content and provides a clean background.
2. **`DashboardLayout.jsx`**: The primary administrative wrapper. It contains:
   - The global sidebar (desktop) or bottom navigation (mobile).
   - The top header.
   - The logout trigger.

## Route Guards

The `ProtectedRoute.jsx` wrapper serves as the primary route guard. It reads the `isAuthenticated` state from the global `AuthContext`. If an unauthenticated user attempts to access any route nested under `ProtectedRoute` (e.g., `/news`), they are seamlessly redirected to `/login`.
