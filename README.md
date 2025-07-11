# BookStore Project

![.NET](https://img.shields.io/badge/.NET-8.0-blue)
![Angular](https://img.shields.io/badge/Angular-v20-red)
![Docker](https://img.shields.io/badge/docker-ready-blue)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Configuration](#configuration)
- [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Development](#development)

  - [Backend](#backend)
  - [Frontend](#frontend)

- [Screenshots](#screenshots)
- [Credits](#credits)

## Overview

I've been asked to build this project to manage books and treat the XML file as if it were a database, providing full persistence and CRUD functionality.

BookStore is a clean-architecture .NET solution with an Angular frontend. It provides a full system for managing books stored in XML format, offering filtering, reporting, and Docker support.

## Features

- Full CRUD operations (Create, Read, Update, Delete) on books
- Pagination, keyword search, and category filtering
- Distinct category listing ordered by popularity
- HTML report generation with UTC timestamp
- Configurable XML file path per environment (development, production, testing)
- Clean Architecture and SOLID principles
- Docker Compose support for running backend and frontend together

## Configuration

The XML data file path is defined in `appsettings.json`:

```json
"BookStore": {
  "XmlFilePath": "data/books.xml"
}
```
**Configuring XmlFilePath**
You can define `XmlFilePath` in several ways, in order of precedence:

**By Command-line argument**
Example:

```
dotnet run --BookStore:XmlFilePath="C:\\data\\books.xml"
```

**By Environment variable**
Example (Linux):

```
export BookStore__XmlFilePath=/data/books.xml
```

Windows:
```
setx BookStore__XmlFilePath "C:\data\books.xml"
```

**`By appsettings.{Environment}.json`** (e.g., `appsettings.Development.json`)

**`appsettings.json`** (default fallback)


You can override this value in production:

- Via `appsettings.Production.json`
- Or with an environment variable:

  ```bash
  BookStore__XmlFilePath=/data/books.xml
  ```

When running in Docker, `/data/books.xml` is mounted via a volume to your host `./data/books.xml`. This file exist with demo values.

## Running with Docker

This project includes a Docker Compose setup to run both services together.

### Quick Start

```bash
docker-compose up --build
```

- Backend: [http://localhost:5206](http://localhost:5206) (Docker) / [https://localhost:5000](https://localhost:5000) (Local)
- Frontend: [http://localhost:4200](http://localhost:4200)

### Example docker-compose.yml

```yaml
services:
  backend:
    build:
      context: ./BookStore_Backend
      dockerfile: Dockerfile
    ports:
      - "5206:5206"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - BookStore__XmlFilePath=/data/books.xml
    volumes:
      - ./data/books.xml:/data/books.xml

  frontend:
    build:
      context: ./bookstore_frontend
      dockerfile: Dockerfile
    ports:
      - "4200:80"

```

## API Endpoints

| Method | Endpoint                | Description                             |
| ------ | ----------------------- | --------------------------------------- |
| GET    | `/api/books`            | Retrieve paged books with search/filter |
| GET    | `/api/books/{isbn}`     | Retrieve a single book by ISBN          |
| POST   | `/api/books`            | Create a new book                       |
| PUT    | `/api/books/{isbn}`     | Update an existing book                 |
| DELETE | `/api/books/{isbn}`     | Delete a book                           |
| GET    | `/api/books/categories` | Retrieve distinct categories            |
| GET    | `/api/books/report`     | Download an HTML report                 |
| GET    | `/api/books/stats`      | Get a stats for books                   |

## Development

### Backend

1. Clone the repository.
2. Configure `BookStore:XmlFilePath`.
3. Run:

   ```bash
   dotnet build
   dotnet run --project BookStore.API
   ```

The backend will be available at `https://localhost:5000` or on `http://localhost:5206` on docker .

### Frontend

Built with Angular v20, Standalone Components, and Angular Material.

**Features:**

- Paginated book listing with search and filters
- Add, edit, and delete books
- Download HTML report
- Save user preferences in local storage

**Technologies:**

- Angular Standalone Components
- Angular Material
- RxJS

**Running Frontend:**

```bash
cd bookstore_frontend
npm install
npm start
```

Access at `http://localhost:4200`.

## Screenshots

### 📘 Add New Book

![Add New Book](docs/screenshot-add-new-book.png)

### 📗 Book Table with Stats

![Book Table Stats](docs/screenshot-book-table-stats.png)

### 🌙 Dark Mode

![Dark Mode](docs/screenshot-dark-mode.png)

### ✏️ Edit Book

![Edit Book](docs/screenshot-edit-book.png)

### ✅ New Book Created Highlight

![New Book Created](docs/screenshot-new-book-created.png)

### 🔍 Perform Search

![Perform Search](docs/screenshot-perfurm-search.png)

## Credits

Made with ❤️ by Omri Beladev.
