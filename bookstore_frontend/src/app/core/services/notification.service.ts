import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, options?: { duration?: number; action?: string }) {
    this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: { duration?: number; action?: string }) {
    this.show(message, { ...options, type: 'error', duration: options?.duration ?? 5000 });
  }

  warning(message: string, options?: { duration?: number; action?: string }) {
    this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: { duration?: number; action?: string }) {
    this.show(message, { ...options, type: 'info' });
  }

  private show(message: string, options?: { duration?: number; action?: string; type?: 'success' | 'error' | 'warning' | 'info' }) {
    const panelClass = ['app-notification'];
    if (options?.type) {
      panelClass.push(`app-notification-${options.type}`);
    }

    this.snackBar.open(message, options?.action ?? 'Close', {
      duration: options?.duration ?? 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass,
    });
  }
}
