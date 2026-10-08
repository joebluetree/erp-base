import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from './api-base-url';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';

describe('apiBaseUrlInterceptor', () => {
  function setup(base: string) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: base },
      ],
    });
    return { http: TestBed.inject(HttpClient), controller: TestBed.inject(HttpTestingController) };
  }

  it('prefixes relative URLs with the configured base', () => {
    const { http, controller } = setup('/api');
    http.get('todos').subscribe();

    controller.expectOne('/api/todos').flush([]);
    controller.verify();
  });

  it('changing the base changes every request', () => {
    const { http, controller } = setup('https://erp.example.com/api/');
    http.get('/todos/1').subscribe();

    controller.expectOne('https://erp.example.com/api/todos/1').flush({});
    controller.verify();
  });

  it('leaves absolute URLs alone', () => {
    const { http, controller } = setup('/api');
    http.get('https://other.example.com/x').subscribe();

    controller.expectOne('https://other.example.com/x').flush({});
    controller.verify();
  });
});
