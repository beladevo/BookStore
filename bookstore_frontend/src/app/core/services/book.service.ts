import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_ROUTES } from '../constants/api-routes';
import { PagedResponse } from '../models/api/api-response.model';
import { Book } from '../models/book.model';
import { buildParams } from '../../shared/utils/http-params.util';
import { APP_CONFIG } from '../constants/app-config';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private api: ApiService) {}

  getAll(
    pageNumber: number = 1,
    pageSize: number = APP_CONFIG.DEFAULT_PAGE_SIZE,
    search?: string,
    category?: string
  ): Observable<PagedResponse<Book>> {
    const params = buildParams({
      pageNumber,
      pageSize: Math.min(pageSize, APP_CONFIG.MAX_PAGE_SIZE),
      search,
      category,
    });

    return this.api.get<PagedResponse<Book>>(API_ROUTES.BOOKS, { params });
  }

  getByIsbn(isbn: string): Observable<Book> {
    return this.api.get<Book>(API_ROUTES.BOOK_BY_ISBN(isbn));
  }

  create(book: Book): Observable<Book> {
    return this.api.post<Book>(API_ROUTES.BOOKS, book);
  }

  update(isbn: string, book: Book): Observable<Book> {
    return this.api.put<Book>(API_ROUTES.BOOK_BY_ISBN(isbn), book);
  }

  delete(isbn: string): Observable<void> {
    return this.api.delete<void>(API_ROUTES.BOOK_BY_ISBN(isbn));
  }
}
