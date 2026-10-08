import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Base URL for every backend request. Feature services use paths relative to it, e.g. `todos`. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
