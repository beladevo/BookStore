import { Injectable } from '@angular/core';

type StorageType = 'local' | 'session';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private getStorage(type: StorageType): Storage {
    return type === 'local' ? localStorage : sessionStorage;
  }

  set<T>(key: string, value: T, type: StorageType = 'local'): void {
    this.getStorage(type).setItem(key, JSON.stringify(value));
  }

  get<T>(key: string, type: StorageType = 'local'): T | null {
    const stored = this.getStorage(type).getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  }

  remove(key: string, type: StorageType = 'local'): void {
    this.getStorage(type).removeItem(key);
  }
}
