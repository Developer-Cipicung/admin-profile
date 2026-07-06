# State Management

This application deliberately avoids heavy global state management libraries (like Redux or Zustand). Because the Administrator Dashboard is primarily a CRUD application, state is highly localized and does not need to be deeply shared across disparate DOM trees.

## 1. Global State (React Context)

The only truly global state required is the Authentication state (is the user logged in? who is the user?). This is handled efficiently by the native React Context API (`src/contexts/AuthContext.jsx`).

## 2. Localized Business Logic (Custom Hooks)

For domain modules (like News, Products, Administrators), state is localized into Custom Hooks (e.g., `src/hooks/useNews.js`).

### Benefits of Custom Hooks:
- **Separation of Concerns**: The UI components (`NewsPage.jsx`) become purely presentational, simply calling `const { data, loading, error } = useNews()`.
- **Complex Orchestration**: Logic for debouncing inputs, handling pagination numbers, caching search strings, and catching API errors is cleanly organized in one place rather than sprawling across the page component.
- **Testing and Maintenance**: Hooks can be easily modified or extended without touching the HTML/CSS markup.

## 3. Form State (React Hook Form)

For forms (like the Login Form or future Create/Edit forms), the application utilizes **React Hook Form**.
- It provides uncontrolled inputs by default, vastly improving typing performance.
- It handles complex validation logic natively without requiring manual state synchronization.
