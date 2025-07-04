# BookStore Project

## Overview

BookStore is a clean-architecture .NET solution with an Angular frontend. It provides a complete system for managing books with XML persistence, advanced filtering, and Docker support.

## Features

* Full CRUD operations (Create, Read, Update, Delete) on books
* Pagination, keyword search, and category filtering
* Distinct category listing ordered by popularity
* HTML report generation with UTC timestamp
* Configurable XML file path per environment
* Clean Architecture following SOLID principles
* Docker and Docker Compose ready

## Project Structure

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

bookstore_frontend
  └── Angular v20 application
```

## Configuration

The XML data file path is set in `appsettings.json`:

```json
"BookStore": {
  "XmlFilePath": "data/books.xml"
}
```

You can override this per environment:

* `appsettings.Production.json`
* Environment variable:

  ```bash
  BookStore__XmlFilePath=/data/books.xml
  ```

## Running with Docker

This project includes a Docker configuration to run the backend and frontend together.

### Docker Compose Example

```yaml
version: "3.9"
services:
  api:
    build:
      context: ./BookStore_Backend
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - BookStore__XmlFilePath=/data/books.xml
    volumes:
      - ./data/books.xml:/data/books.xml

  frontend:
    build:
      context: ./bookstore_frontend
    ports:
      - "4200:80"
```

### Running All Services

To build and start the entire system:

```bash
docker-compose up --build
```

The backend will be available at `http://localhost:5000`, and the frontend at `http://localhost:4200`.

## API Endpoints

* `GET /api/books` – Retrieve a paged list of books with optional search and category filters
* `GET /api/books/{isbn}` – Retrieve a single book by ISBN
* `POST /api/books` – Create a new book
* `PUT /api/books/{isbn}` – Update an existing book
* `DELETE /api/books/{isbn}` – Delete a book
* `GET /api/books/categories` – Retrieve all distinct categories
* `GET /api/books/report` – Download an HTML report

## Development (Backend)

1. Clone the repository.
2. Update `BookStore:XmlFilePath` in `appsettings.json`.
3. Run:

   ```bash
   dotnet build
   dotnet run --project BookStore.API
   ```

Backend will be available at `http://localhost:5000` by default.

## Development (Frontend)

The Angular frontend is built with Angular v20 using Standalone Components and Angular Material.

### Features

* Paginated list of books with search and filtering
* Add, edit, and delete books
* Download HTML report
* Persist user preferences (page size, filters) in local storage

### Technologies

* **Angular Standalone Components** for modular design
* **Angular Material** for UI
* **RxJS** for state management

### Running Frontend

1. Navigate to the `bookstore_frontend` folder.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   ng serve
   ```

4. Access the app at `http://localhost:4200`.

### Building Frontend

To create a production build:

```bash
ng build --configuration production
```

## Credits

Made with ❤️ by Omri Beladev.
