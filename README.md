# Admin Profile

This is the Administrator Dashboard frontend for the profile system, built with React 19, Vite, React Router v7, and Tailwind CSS. This project serves as a secure, lightweight, and highly responsive foundation for managing the village profile website.

## Technology Stack

- **React 19**: Modern UI library.
- **Vite**: Fast development build tool.
- **React Router v7**: Declarative routing.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Hook Form**: Form state management and validation.

## Modules Implemented

### 1. Authentication & Security (Phase B)
The application uses stateless JSON Web Token (JWT) authentication.
- Tokens and logged-in usernames are securely stored in `localStorage`.
- Protected routes guard internal pages, and a global API interceptor automatically catches `401 Unauthorized` responses to seamlessly terminate expired sessions.

### 2. Dashboard Overview
- Acts as the main landing page, dynamically aggregating total counts for News, Products, and Administrators using concurrent hooks to keep the UI perfectly responsive.

### 3. News Management (Phase C)
Provides full CRUD (Create, Read, Update, Delete) capabilities for Village News articles.
- Features server-side pagination, debounced searching, and dynamic sorting.
- Supports `multipart/form-data` uploads for article thumbnails with client-side previews.
- Reusable Modals are used for viewing full details and confirming deletions.

### 4. Product Catalog (Phase D)
Provides full CRUD capabilities for the UMKM Product Catalog.
- Architecturally mirrors the News Module to maximize code reuse.
- Uses shared UI components (like `ImageUpload` and `DeleteConfirmationModal`) and generalized pagination helpers.

### 5. Administrator Management (Phase E)
A highly secure module for managing dashboard access.
- Lists all active administrators with robust filtering and sorting.
- Supports creating new administrators (with strong password validation and `409 Conflict` detection).
- Features a **Current User Highlight** that visually identifies the logged-in user and safely disables their "Delete" button.
- Strictly enforces backend fail-safes (e.g., catching `403 Forbidden` if attempting to delete the final system administrator).

## Folder Structure

- **`src/components/`**: Presentational components grouped by module (`common`, `news`, `products`, `administrators`).
- **`src/constants/`**: Application-wide configurations and magic strings.
- **`src/contexts/`**: Global state providers (e.g., AuthContext).
- **`src/hooks/`**: Reusable custom hooks grouping business logic (`useNews`, `useProducts`, `useAdministrators`, etc.).
- **`src/layouts/`**: Wrappers for pages (e.g., DashboardLayout).
- **`src/pages/`**: Main page components mapped directly to routes.
- **`src/routes/`**: Centralized routing configuration (`index.jsx`, `ProtectedRoute.jsx`).
- **`src/services/`**: API interaction utilities making fetch calls using a central generic Axios wrapper.
- **`src/utils/`**: Helper utilities (e.g., `token.js`, `date.js`, `paginationHelper.js`).

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` points to the correct backend API.

## Running Locally

To start the Vite development server:
```bash
npm run dev
```
