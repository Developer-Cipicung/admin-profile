# News Module Documentation

The News Module provides a complete CRUD (Create, Read, Update, Delete) interface for managing village announcements and news articles in the Administrator Dashboard.

## Features Implemented

### 1. Listing (Phase C1)
- **Data Fetching:** Reads from `GET /api/v1/news` using the `useNews` hook.
- **UI:** Displays a responsive layout with a `NewsTable` (for desktop) and a `NewsCard` list (for mobile).
- **Filtering & Search:** Supports server-side searching by title and sorting (newest/oldest) through query parameters.
- **Pagination:** Implements standard cursor/offset pagination via the `Pagination` component.

### 2. Create News (Phase C2)
- **Form Submission:** Submits multipart form data to `POST /api/v1/admin/news`.
- **UI:** A dedicated `CreateNewsPage` utilizes `react-hook-form` to capture Title, Content, and an image Thumbnail.
- **Image Upload:** Incorporates a reusable `ImageUpload` presentational component with local preview and cancellation functionality.
- **Success Handling:** Redirects back to the list view and uses React Router's `location.state` to display a temporary green success banner.

### 3. Edit News (Phase C3)
- **Data Fetching:** Reads the specific article from `GET /api/v1/news/:id` before rendering the form.
- **Form Population:** Reuses the exact same `NewsForm` component utilized in Creation, injecting the fetched data via `defaultValues`.
- **Modification:** Submits changes to `PUT /api/v1/admin/news/:id`. Supports optionally replacing the existing image thumbnail.

### 4. Delete News (Phase C4)
- **Confirmation Flow:** Utilizes a generic `DeleteConfirmationModal` to prevent accidental deletions.
- **State Management:** Uses the isolated `useDeleteNews` hook to manage the `deleting` state and handle network errors without coupling them to the main page logic.
- **Pagination Edge-Case:** Implements a reusable `paginationHelper` that automatically bumps the user back one page if they delete the single remaining item on their current page.

### 5. View Details
- **Modal Display:** Implements a read-only `ViewDetailsModal` allowing administrators to quickly inspect the full content, image, and timestamps of a news article without having to enter the Edit flow.

## Architecture Highlights
- **No Direct State Coupling:** Data fetching is neatly abstracted into hooks. Pages remain lightweight and focused on wiring hooks to components.
- **Component Reuse:** The table, mobile cards, search inputs, pagination, and modals are generic components shared with other modules (like the Product Module).
