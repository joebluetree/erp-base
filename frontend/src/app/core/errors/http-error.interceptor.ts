import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { toApiError } from './api-error';

/**
 * Turns every failed request into an `ApiError`, shows one notification for it, and rethrows.
 * The exception is a 400 with field errors: the calling form shows those next to its fields.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      const apiError = toApiError(error);
      if (!apiError.fieldErrors) {
        notifications.error(apiError.message);
      }
      return throwError(() => apiError);
    }),
  );
};
