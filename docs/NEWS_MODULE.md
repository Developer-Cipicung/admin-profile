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
- **UI:** A dedicated `CreateNewsPage` utilizes `react-hook-form` to capture Title, Event Date (`created_at`, optional), Content, and an image Thumbnail.
- **Event Date Selection:** Allows administrators to select a custom event date via a date picker. If omitted, the backend defaults to the current timestamp.
- **Image Upload:** Incorporates a reusable `ImageUpload` presentational component with local preview and cancellation functionality.
- **Success Handling:** Redirects back to the list view and uses React Router's `location.state` to display a temporary green success banner.

### 3. Edit News (Phase C3)
- **Data Fetching:** Reads the specific article from `GET /api/v1/news/:id` before rendering the form.
- **Form Population:** Reuses the exact same `NewsForm` component utilized in Creation, injecting the fetched data (including formatted `created_at` date for input) via `defaultValues`.
- **Modification:** Submits changes to `PUT /api/v1/admin/news/:id`. Supports optionally updating the event date and replacing the existing image thumbnail.

### 4. Delete News (Phase C4)
- **Confirmation Flow:** Utilizes a generic `DeleteConfirmationModal` to prevent accidental deletions.
- **State Management:** Uses the isolated `useDeleteNews` hook to manage the `deleting` state and handle network errors without coupling them to the main page logic.
- **Pagination Edge-Case:** Implements a reusable `paginationHelper` that automatically bumps the user back one page if they delete the single remaining item on their current page.

### 5. View Details
- **Detail & Modal Display:** Implements `ViewNewsPage` and read-only views allowing administrators to inspect the full content, image, event date (`created_at`), and update timestamp (`updated_at`) of a news article.

## Architecture Highlights
- **No Direct State Coupling:** Data fetching is neatly abstracted into hooks. Pages remain lightweight and focused on wiring hooks to components.
- **Component Reuse:** The table, mobile cards, search inputs, pagination, and modals are generic components shared with other modules (like the Product Module).

