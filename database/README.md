# Database Structure

This directory contains the SQLite database used by the bookstore application.

## Structure

- `books.db`: Main database file (created when the application runs)
- `migrations/`: Contains database migration scripts
- `backups/`: Contains database backups

## Database Schema

The database contains the following tables:

- `books`: Main table containing book information
- `categories`: Book categories
- `book_categories`: Junction table for books and categories
- `tags`: Book tags
- `book_tags`: Junction table for books and tags
- `awards`: Book awards
- `book_awards`: Junction table for books and awards

## How to Reset the Database

To reset the database, run:

```bash
npm run migrate
```

This will re-create the database from the CSV data in `src/data/books.csv`.

## Database Location

The application looks for the database file `books.db` in the project root. When running migrations or database operations, the file will be created automatically if it doesn't exist. 