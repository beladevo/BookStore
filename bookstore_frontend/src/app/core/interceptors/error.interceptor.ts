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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unexpected error occurred.';

        if (error.error?.message) {
          message = error.error.message;
        }

        switch (error.status) {
          case 0:
            message = 'Cannot connect to server.';
            break;
          case 400:
            message = 'Bad request.';
            break;
          case 404:
            message = 'Resource not found.';
            break;
          case 500:
            message = 'Internal server error.';
            break;
        }

        this.notify.show(message, { duration: 5000 });

        return throwError(() => error);
      })
    );
  }
}
