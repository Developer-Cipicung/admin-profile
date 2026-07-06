# Environment Variables

This document outlines the required environment configurations for the `admin-profile` application.

## `.env` File

Vite requires environment variables to be prefixed with `VITE_` to expose them to the client-side JavaScript.

Create a `.env` file in the root of the `admin-profile` directory (you can copy `.env.example`).

### Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | The base URL pointing to the `profile-api` backend server. | `http://localhost:3000/api/v1` |

## Accessing Variables in Code

Use Vite's `import.meta.env` object.

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

> **Note**: A fallback is hardcoded in `api.js` in case the variable is missing (`http://localhost:3000/api/v1`), ensuring the application works out of the box for local development.
