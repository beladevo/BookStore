import { Routes } from '@angular/router';
import { BookTable } from './features/books/book-table/book-table';
import { BookForm } from './features/books/book-form/book-form';

export const routes: Routes = [
  { path: '', component: BookTable },
  { path: 'books/:isbn/edit', component: BookForm },
  { path: 'books/new', component: BookForm },
];
