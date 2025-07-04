import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  show() {
    this.requestCount++;
    this._loading$.next(true);
  }

  hide() {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this._loading$.next(false);
    }
  }
}
