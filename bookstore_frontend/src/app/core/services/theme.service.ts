import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { CACHE_KEYS } from '../constants/cache-keys';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storage = inject(StorageService);
  private darkMode$ = new BehaviorSubject<boolean>(this.getInitialMode());

  isDarkMode$ = this.darkMode$.asObservable();

  toggleDarkMode() {
    const next = !this.darkMode$.value;
    this.darkMode$.next(next);
    this.applyTheme(next);
    this.storage.set(CACHE_KEYS.DARK_MODE, next);
  }

  private getInitialMode(): boolean {
    const stored = this.storage.get<boolean>(CACHE_KEYS.DARK_MODE);
    if (stored !== null) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  constructor() {
    this.applyTheme(this.darkMode$.value);
  }
}
