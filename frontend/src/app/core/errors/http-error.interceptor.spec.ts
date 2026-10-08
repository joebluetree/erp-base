import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { NotificationService } from '../notifications/notification.service';
import { ApiError, NETWORK_ERROR_MESSAGE, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE } from './api-error';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  const notifications = { error: vi.fn() };
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    notifications.error.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notifications },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  async function failWith(status: number, body: object | null): Promise<ApiError> {
    const result = firstValueFrom(http.get('/x')).catch((e: ApiError) => e);
    const req = controller.expectOne('/x');
    if (status === 0) {
      req.error(new ProgressEvent('error'));
    } else {
      req.flush(body, { status, statusText: 'ignored' });
    }
    return (await result) as ApiError;
  }

  it('notifies once and rethrows an ApiError for a server error', async () => {
    const error = await failWith(500, { detail: 'secret' });

    expect(error.status).toBe(500);
    expect(notifications.error).toHaveBeenCalledExactlyOnceWith(SERVER_ERROR_MESSAGE);
  });

  it('notifies for not found', async () => {
    await failWith(404, null);
    expect(notifications.error).toHaveBeenCalledExactlyOnceWith(NOT_FOUND_MESSAGE);
  });

  it('notifies when the server cannot be reached', async () => {
    const error = await failWith(0, null);

    expect(error.status).toBe(0);
    expect(notifications.error).toHaveBeenCalledExactlyOnceWith(NETWORK_ERROR_MESSAGE);
  });

  it('passes 400 field errors to the caller without a generic notification', async () => {
    const error = await failWith(400, { errors: { Title: ['Title is required.'] } });

    expect(error.fieldErrors).toEqual({ title: ['Title is required.'] });
    expect(notifications.error).not.toHaveBeenCalled();
  });
});
