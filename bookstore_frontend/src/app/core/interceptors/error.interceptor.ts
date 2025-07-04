import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notify: NotificationService, private router: Router) {}

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 0:
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 400:
        if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          return `Validation error: ${validationErrors.join(', ')}`;
        }
        return 'The request was invalid. Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'An internal server error occurred. Our team has been notified and we are working to fix it.';
      case 503:
        return 'The service is temporarily unavailable. Please try again in a few minutes.';
      default:
        return `An unexpected error occurred. Please try again later.`;
    }
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);
        this.notify.error(message);

        return throwError(() => error);
      })
    );
  }
}
