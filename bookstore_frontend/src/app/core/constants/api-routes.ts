export const API_ROUTES = {
  BOOKS: 'books',
  BOOK_BY_ISBN: (isbn: string) => `books/${isbn}`,
  BOOKS_REPORT: 'books/report',
  CATEGORIES: 'books/categories',
};
