# Product Module Documentation

The Product Module provides a complete interface for managing the UMKM Product Catalog in the Administrator Dashboard. It was built as a deliberate structural mirror to the News Module, ensuring architectural consistency across the application.

## Features Implemented

### 1. Product Listing (Phase D1)
- **Data Fetching:** Retrieves products from `GET /api/v1/products` using the `useProducts` hook.
- **UI:** Implements a responsive dual-view system (`ProductTable` for desktop, `ProductCard` for mobile screens).
- **Interactions:** Supports server-side search, multi-directional sorting (price, newest, name), and page-based pagination.
- **View Modal:** Reuses the `ViewDetailsModal` to show a quick pop-up overlay containing the product's full information and image.

### 2. Create Product (Phase D2)
- **Form Submission:** Sends multipart form data to `POST /api/v1/admin/products`.
- **UI & Validation:** Uses `ProductForm` built on top of `react-hook-form` to capture Name, Description, Price, and Image. Client-side validation ensures all required fields and correct data types are provided before submission.
- **Image Handling:** Integrates the generic `ImageUpload` component (extracted and generalized during this phase from the News module) to support drag-and-drop uploads and image previews.
- **Success Notification:** Uses React Router state passing to display a seamless success banner upon redirecting to the catalog.

### 3. Edit Product (Phase D3)
- **Backend Addition:** A brand new `GET /api/v1/products/:id` endpoint was engineered on the API to enable proper, stateless direct-linking to the edit form.
- **Data Loading:** The `EditProductPage` utilizes `useEditProduct` to fetch the specific product details on mount, avoiding unreliable React Router state passing.
- **Form Reusability:** Identical to the News module, it injects `defaultValues` straight into the `ProductForm`, rendering the exact same UI as the Create page but filled with editable data.
- **Image Replacement:** Handles replacing existing product imagery without destructive delete commands, aligning with the backend's image replacement logic.

### 4. Delete Product (Phase D4)
- **Protected Deletion:** Reuses the `DeleteConfirmationModal` to intercept delete requests.
- **Hook Isolation:** Utilizes `useDeleteProduct` to strictly isolate network requests and loading states from the main `ProductPage` render cycle.
- **Intelligent Pagination:** Connects to `handlePaginationAfterDelete` (located in `src/utils/paginationHelper.js`) to intelligently detect if the last product on a paginated page was deleted, automatically moving the user to the previous page to prevent rendering an empty state.

## Architectural Notes
- The entire module strictly adheres to the standard pattern: `Page ➔ Hook ➔ Service ➔ API Wrapper`.
- Code duplication was heavily avoided by refactoring News components (like the `ThumbnailUpload`) into generic common components (`ImageUpload`).
