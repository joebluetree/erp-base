import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { httpErrorInterceptor } from '../../core/errors/http-error.interceptor';
import { NotificationService } from '../../core/notifications/notification.service';
import { Todo } from '../feature-template/todos/todo.model';
import { Dashboard } from './dashboard';

const todo = (id: string, isCompleted: boolean): Todo => ({ id, title: `T${id}`, description: null, isCompleted });

describe('Dashboard', () => {
  const notifications = { error: vi.fn() };
  let controller: HttpTestingController;

  beforeEach(() => {
    notifications.error.mockReset();
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notifications },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  function create() {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  async function settle(fixture: ReturnType<typeof create>['fixture']) {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  const count = (el: HTMLElement, id: string) => el.querySelector(`[data-testid="${id}"]`)?.textContent?.trim();

  it('shows total, open and completed counts', async () => {
    const { fixture, el } = create();
    controller.expectOne('todos').flush([todo('1', true), todo('2', false), todo('3', false), todo('4', true), todo('5', false)]);
    await settle(fixture);

    expect(count(el, 'total')).toBe('5');
    expect(count(el, 'open')).toBe('3');
    expect(count(el, 'completed')).toBe('2');
  });

  it('shows zeros when there are no todos', async () => {
    const { fixture, el } = create();
    controller.expectOne('todos').flush([]);
    await settle(fixture);

    expect([count(el, 'total'), count(el, 'open'), count(el, 'completed')]).toEqual(['0', '0', '0']);
  });

  it('shows a loading indicator instead of the cards while loading', () => {
    const { el } = create();

    expect(el.querySelector('hlm-spinner')).toBeTruthy();
    expect(el.querySelector('[data-testid="total"]')).toBeNull();
    controller.expectOne('todos');
  });

  it('shows a friendly message, one notification and still the quick links when loading fails', async () => {
    const { fixture, el } = create();
    controller.expectOne('todos').flush({ detail: 'ORA-00942 secret' }, { status: 500, statusText: 'x' });
    await settle(fixture);

    expect(el.querySelector('.summary-error')?.textContent).toContain('could not be loaded');
    expect(el.textContent).not.toContain('ORA-00942');
    expect(el.querySelector('[data-testid="total"]')).toBeNull();
    expect(notifications.error).toHaveBeenCalledOnce();
    expect(el.querySelector('.quick-links a[href="/todos"]')).toBeTruthy();
  });

  it('shows a Todos quick link and none for the Dashboard itself', async () => {
    const { fixture, el } = create();
    controller.expectOne('todos').flush([]);
    await settle(fixture);

    const links = Array.from(el.querySelectorAll('.quick-links a')).map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/todos']);
  });

  it('only reads: sends a single GET and no writes', async () => {
    const { fixture } = create();
    const req = controller.expectOne('todos');
    expect(req.request.method).toBe('GET');
    req.flush([todo('1', false)]);
    await settle(fixture);

    controller.expectNone((r) => r.method !== 'GET');
  });
});
