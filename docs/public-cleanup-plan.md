# Public Directory Cleanup Plan

## Current Structure
- `/public/images/books/`: Contains book cover images (ISBN-named JPG files)
- `/public/images/`: Contains certification logos (enamad.png, samandehi.png)
- `/public/`: Contains default-book-cover.png and potentially other assets

## Issues Identified
1. Some book cover images may be small placeholders (as seen in the update-book-covers.ts script)
2. File naming is inconsistent (some with spaces in filenames)
3. No clear organization for different types of assets

## Cleanup Tasks

### 1. Organize Directory Structure
```
/public/
  /images/
    /books/       # Book cover images
    /logos/       # Certification and other logos
    /icons/       # Application icons
    /backgrounds/ # Background images
  /favicons/      # Favicon and related browser icons
  /default/       # Default placeholder images
```

### 2. Standardize Image Naming
- Book covers: Use consistent ISBN format without spaces (e.g., `9789644481545.jpg`)
- Default images: Use descriptive names (e.g., `default-book-cover.png`)
- Logos: Use company/organization name (e.g., `enamad.png`, `samandehi.png`)

### 3. Image Optimization
- Ensure all images are properly optimized for web
- Convert large images to appropriate sizes
- Use modern formats where supported (WebP with fallbacks)

### 4. Update References
- Update the scripts that handle book covers to use the new directory structure
- Modify components that reference these images (like BookCard.tsx)

### 5. Documentation
- Add a README.md to the public directory explaining the organization
- Document image size requirements and formats

## Implementation Steps
1. Create the new directory structure
2. Move existing files to their appropriate locations
3. Rename files for consistency
4. Update references in code
5. Add documentation 