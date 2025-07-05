import { Routes } from '@angular/router';
import { BookForm } from './features/books/book-form/book-form';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'books/:isbn/edit', component: BookForm },
  { path: 'books/new', component: BookForm },
];
