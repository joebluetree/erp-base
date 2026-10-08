import { Injectable } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';

const DURATION_MS = 5000;

/** The one way features give the user feedback. Rendered by the root `hlm-toaster`. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string): void {
    toast.success(message, { duration: DURATION_MS });
  }

  info(message: string): void {
    toast.info(message, { duration: DURATION_MS });
  }

  warn(message: string): void {
    toast.warning(message, { duration: DURATION_MS });
  }

  error(message: string): void {
    toast.error(message, { duration: DURATION_MS });
  }
}
