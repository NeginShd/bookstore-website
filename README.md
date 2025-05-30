# Bookstore Website

A modern Next.js-based bookstore website with RTL support and AI-powered features.

## Project Structure

- **/src/** - Source code for the application
  - `/app/` - Next.js application routes and API endpoints
  - `/components/` - React components
  - `/lib/` - Utilities, services, and database operations
  - `/contexts/` - React context providers
  - `/hooks/` - Custom React hooks
  - `/ai/` - AI integration with Genkit

- **/public/** - Static assets
  - `/images/` - Images for the website
  - `/default/` - Default placeholder images
  - `/favicons/` - Browser favicon files

- **/database/** - Database files and migrations
  - `/data/` - CSV data files for initial database setup
  - `/migrations/` - Database migration scripts
  - `/backups/` - Database backup scripts

- **/scripts/** - Utility scripts
  - `/database/` - Database management scripts
  - `/images/` - Image processing scripts
  - `/build/` - Build and deployment scripts
  - `/legacy/` - Legacy scripts kept for reference

- **/docs/** - Documentation
  - `/api/` - API documentation
  - `/development/` - Development guides
  - `/features/` - Feature documentation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone [repository-url]
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database
   ```
   npm run db:setup
   npm run db:migrate
   npm run migrate
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Available Scripts

### Development
- `npm run dev` - Start the development server
- `npm run dev:turbo` - Start the development server with Turbopack

### Database
- `npm run db:setup` - Initialize the database
- `npm run db:migrate` - Run database migrations
- `npm run db:backup` - Backup the database
- `npm run db:reset` - Reset the database
- `npm run migrate` - Migrate CSV data to the database
- `npm run update-prices` - Update book prices

### Build
- `npm run build` - Build the application
- `npm run start` - Start the production server
- `npm run clean` - Clean the build directory

### Images
- `npm run update-covers` - Update book cover images

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: SQLite
- **AI**: Google Gemini API via Genkit
- **Components**: Shadcn UI, Radix UI

## Documentation

For more detailed documentation, see the [docs directory](./docs/README.md). 