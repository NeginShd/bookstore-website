# Source Directory Structure

This directory contains the main source code for the bookstore website application.

## Directory Structure

- `/app/` - Next.js application routes and API endpoints
  - `/api/` - Backend API endpoints
  - Various page routes

- `/components/` - React components organized by function
  - `/auth/` - Authentication components
  - `/books/` - Book-related components
  - `/cart/` - Shopping cart components
  - `/layout/` - Layout components (header, footer, etc.)
  - `/navigation/` - Navigation components
  - `/ui/` - Reusable UI components

- `/contexts/` - React context providers
  - `CartContext.tsx` - Shopping cart state management
  - `ThemeContext.tsx` - Theme state management
  - `UserContext.tsx` - User authentication state

- `/hooks/` - Custom React hooks
  - `use-mobile.tsx` - Mobile device detection hook
  - `use-toast.ts` - Toast notification hook

- `/lib/` - Utilities, services, and helpers
  - `/database/` - Database connection and management
  - `/services/` - Business logic services
  - `/utils/` - Utility functions

- `/ai/` - AI integration with Genkit
  - `/flows/` - AI conversation flows

## Key Files

- `app/layout.tsx` - Main application layout
- `app/page.tsx` - Homepage
- `lib/types.ts` - TypeScript type definitions

## Importing

The codebase uses path aliases. Import components and utilities like this:

```typescript
// Import from lib
import { BookService, cn } from '@/lib';

// Import components
import { Button } from '@/components/ui/button';
``` 