import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, shareReplay } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private _categories$!: Observable<string[]>;

  constructor(private api: ApiService) {}

  getCategories(): Observable<string[]> {
    if (!this._categories$) {
      this._categories$ = this.api
        .get<string[]>(API_ROUTES.CATEGORIES)
        .pipe(shareReplay(1));
    }
    return this._categories$;
  }
}
