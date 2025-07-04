# BookStore Project

![.NET](https://img.shields.io/badge/.NET-8.0-blue)
![Angular](https://img.shields.io/badge/Angular-v20-red)
![Docker](https://img.shields.io/badge/docker-ready-blue)

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Configuration](#configuration)
* [Running with Docker](#running-with-docker)
* [API Endpoints](#api-endpoints)
* [Development](#development)

  * [Backend](#backend)
  * [Frontend](#frontend)
* [Known Issues](#known-issues)
* [Future Work](#future-work)
* [Screenshots](#screenshots)
* [License](#license)
* [Credits](#credits)

## Overview
I've been asked to build this project to manage books and treat the XML file as if it were a database, providing full persistence and CRUD functionality.

BookStore is a clean-architecture .NET solution with an Angular frontend. It provides a full system for managing books stored in XML format, offering filtering, reporting, and Docker support.

## Features

* Full CRUD operations (Create, Read, Update, Delete) on books
* Pagination, keyword search, and category filtering
* Distinct category listing ordered by popularity
* HTML report generation with UTC timestamp
* Configurable XML file path per environment (development, production, testing)
* Clean Architecture and SOLID principles
* Docker Compose support for running backend and frontend together

## Configuration

The XML data file path is defined in `appsettings.json`:

```json
"BookStore": {
  "XmlFilePath": "data/books.xml"
}
```

You can override this value in production:

* Via `appsettings.Production.json`
* Or with an environment variable:

  ```bash
  BookStore__XmlFilePath=/data/books.xml
  ```

When running in Docker, `/data/books.xml` is mounted via a volume to your host `./data/books.xml`. Make sure this file exists or is created on first run.

## Running with Docker

This project includes a Docker Compose setup to run both services together.

### Quick Start

```bash
docker-compose up --build
```

* Backend: [https://localhost:5001](https://localhost:5001)
* Frontend: [http://localhost:4200](http://localhost:4200)

### Example docker-compose.yml

```yaml
version: "3.9"
services:
  api:
    build:
      context: ./BookStore_Backend
    ports:
      - "5001:80"
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

## Development

### Backend

1. Clone the repository.
2. Configure `BookStore:XmlFilePath`.
3. Run:

   ```bash
   dotnet build
   dotnet run --project BookStore.API
   ```

The backend will be available at `http://localhost:5001`.

### Frontend

Built with Angular v20, Standalone Components, and Angular Material.

**Features:**

* Paginated book listing with search and filters
* Add, edit, and delete books
* Download HTML report
* Save user preferences in local storage

**Technologies:**

* Angular Standalone Components
* Angular Material
* RxJS

**Running Frontend:**

```bash
cd bookstore_frontend
npm install
npm start
```

Access at `http://localhost:4200`.

**Production Build:**

```bash
npm run build:prod
```

## Screenshots

![Book List](docs/screenshot-list.png)

![Book Details](docs/screenshot-details.png)


## Credits

Made with ❤️ by Omri Beladev.
