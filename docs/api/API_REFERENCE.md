# API Reference

This document provides details about the API endpoints available in the bookstore application.

## Book APIs

```
GET /api/books                    # Get all books
GET /api/books?id=1               # Get a specific book
GET /api/books?search=query       # Search books by text
GET /api/books?genre=fiction      # Filter books by genre
GET /api/books?category=bestsellers # Filter books by category
GET /api/books?page=1&limit=10    # Pagination
```

## Category APIs

```
GET /api/categories               # Get all categories
```

## Genre APIs

```
GET /api/genres                   # Get all genres
```

## Authentication APIs

```
POST /api/login                   # User login
POST /api/register                # User registration
POST /api/staff/login             # Staff login
```

## Response Formats

### Book Response Format

```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "year": 2021,
  "genre": "Fiction",
  "original_language": "English",
  "translator": "Translator Name",
  "summary": "Book summary...",
  "publisher": "Publisher Name",
  "pages": 300,
  "isbn": "978-3-16-148410-0",
  "price": 250000,
  "cover_image": "https://example.com/cover.jpg",
  "available": true,
  "rating": 4.5,
  "review_count": 120,
  "popularity": 85,
  "sales_rank": 42,
  "is_hot": true,
  "is_new": true,
  "categories": ["bestsellers", "new-releases"],
  "tags": ["fiction", "contemporary"]
}
```

### Category Response Format

```json
{
  "id": 1,
  "name": "bestsellers",
  "description": "Best selling books",
  "book_count": 15
}
```

### Genre Response Format

```json
{
  "name": "Fiction",
  "book_count": 25
}
```

## Error Handling

All APIs follow a standard error response format:

```json
{
  "error": true,
  "message": "Error message",
  "status": 400
}
```

Common status codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error 