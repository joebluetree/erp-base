import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from './api-base-url';

/** Prefixes relative request URLs with the configured API base URL. Absolute URLs are left alone. */
export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(req.url)) {
    return next(req);
  }
  const base = inject(API_BASE_URL).replace(/\/+$/, '');
  const path = req.url.replace(/^\/+/, '');
  return next(req.clone({ url: `${base}/${path}` }));
};
