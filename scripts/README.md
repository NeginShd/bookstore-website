# Scripts Directory

This directory contains scripts used for database maintenance, image management, build processes, and other utilities.

## Directory Structure

- `/database/` - Database-related scripts
- `/images/` - Image and asset management scripts
- `/build/` - Build and deployment scripts
- `/legacy/` - Legacy scripts kept for reference

## Database Scripts

### `database/migrate-csv-to-db.ts`
Migrates book data from CSV files to the SQLite database.
- Run with: `npm run migrate`

### `database/update-prices-to-toman.ts`
Converts book prices to Toman currency.
- Run with: `npm run update-prices`

### `database/csv-to-sqlite.js`
Legacy script for converting CSV data to SQLite.

## Image Scripts

### `images/update-book-covers.ts`
Updates book cover images by fetching them from Google Books API or Open Library API.
- Run with: `npm run update-covers`

### `images/add-certification-logos.sh` / `add-certification-logos.bat`
Adds certification logos to the website.

### `images/generate-favicon.js`
Generates favicon files from a source image.

## Build Scripts

### `build/clean-build.js`
Removes the .next directory to ensure a clean build.
- Run with: `npm run clean`

## Legacy Scripts

These scripts are kept for reference but are not actively used:

- `legacy/download-book-covers.js` - Downloads book covers from external APIs
- `legacy/fetch-book-titles.js` - Exports book data to JSON
- `legacy/google-books-covers.js` - Fetches book covers from Google Books API
- `legacy/run-update-covers.js` - Helper script for running update-book-covers.ts
- `legacy/test-gemini-api.sh` - Test script for Google's Gemini API

## Adding New Scripts

When adding new scripts to this project:

1. Place them in the appropriate subdirectory based on their purpose
2. Use TypeScript (.ts) for new scripts when possible
3. Add a reference in this README.md file
4. For scripts that should be run via npm, add an entry in package.json

## Script Naming Conventions

- Use kebab-case for script filenames (e.g., `update-book-covers.ts`)
- Use descriptive names that clearly indicate the script's purpose
- For related scripts, use a common prefix (e.g., `book-cover-download.js`, `book-cover-update.js`) 