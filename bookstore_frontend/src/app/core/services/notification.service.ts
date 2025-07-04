import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, options?: { duration?: number; action?: string }) {
    this.snackBar.open(message, options?.action ?? 'Close', {
      duration: options?.duration ?? 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'app-notification',
    });
  }
}
