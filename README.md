# BookStore Project

## Overview

BookStore is a clean-architecture .NET project for managing books, supporting XML-based persistence, paging, filtering, and an Angular frontend.

## Features

- CRUD operations on books (Create, Read, Update, Delete)
- Pagination, search, and category filtering
- Distinct categories listing (ordered by popularity)
- HTML report generation with UTC timestamp
- Configurable XML file path per environment
- Clean architecture and SOLID principles
- Docker-ready configuration

### Project Structure

```
BookStore.Core
  ├── Entities
  │   └── Book.cs
  ├── Interfaces
  │   ├── IBookRepository.cs
  │   └── IBookService.cs
  └── Exceptions
      └── BusinessLogicException.cs

BookStore.Application
  └── Services
      └── BookService.cs

BookStore.Data
  └── Repositories
      └── XmlBookRepository.cs

BookStore.API
  ├── Controllers
  │   └── BooksController.cs
  ├── Middleware
  │   └── ExceptionHandlingMiddleware.cs
  └── Program.cs
```


## Configuration

The XML file path is configured in `appsettings.json`:

```json
"BookStore": {
  "XmlFilePath": "data/books.xml"
}
```

You can override this per environment:

- `appsettings.Production.json`
- Environment variable:

  ```
  BookStore__XmlFilePath=/data/books.xml
  ```

## Running with Docker

Example `docker-compose.override.yml`:

```yaml
version: "3.4"

services:
  bookstore.api:
    environment:
      - BookStore__XmlFilePath=/data/docker-books.xml
    volumes:
      - bookdata:/data
```

## API Endpoints

- `GET /api/books` – Get paged list of books with optional search/category
- `GET /api/books/{isbn}` – Get single book by ISBN
- `POST /api/books` – Create a book
- `PUT /api/books/{isbn}` – Update a book
- `DELETE /api/books/{isbn}` – Delete a book
- `GET /api/books/categories` – Get distinct categories
- `GET /api/books/report` – Get HTML report

## Development

1. Clone repository
2. Update `BookStore:XmlFilePath` in `appsettings.json`
3. Run:

   ```bash
   dotnet build
   dotnet run --project BookStore.API
   ```

## Frontend

The Angular frontend is built with Angular **v20** using Standalone Components and Angular Material.

### Features

- Paginated book list with search and category filtering
- Create, edit, and delete books
- Download an HTML report
- Persist user preferences (e.g., page size) in localStorage

### Technologies

- **Angular Standalone Components** for modular structure
- **Angular Material** for UI components
- **RxJS** for reactive state management

### Running

1. Navigate to the `bookstore_frontend` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   ng serve
   ```

4. The app will be available at `http://localhost:4200`.

### Build

To create a production build:

```bash
ng build --configuration production
```

---

Made with ❤️ by Omri Beladev.
