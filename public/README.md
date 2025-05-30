# Public Assets Directory

This directory contains static assets that are served directly by the web server.

## Directory Structure

- `/images/` - All image assets
  - `/books/` - Book cover images (named by ISBN)
  - `/logos/` - Certification and business logos
- `/default/` - Default placeholder images
- `/favicons/` - Browser favicon files

## Image Guidelines

### Book Covers
- Format: JPG or WebP
- Naming: Use ISBN as filename (e.g., `9789644481545.jpg`)
- Dimensions: 600px × 900px (2:3 aspect ratio)

### Logos
- Format: PNG with transparency
- Resolution: At least 200px width
- Background: Transparent

### Placeholder Images
- Should be placed in the `/default/` directory
- Must include fallbacks for when dynamic images fail to load

## Scripts

Several scripts are available to manage these assets:

- `npm run update-covers` - Updates book cover images from external APIs
- `scripts/add-certification-logos.sh` - Adds certification logos

## Important Notes

1. Do not delete the default book cover image as it's used as a fallback
2. Certification logos (enamad.png, samandehi.png) are required for legal compliance
3. All images should be optimized for web before being added to this directory 