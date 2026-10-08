import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';
import { TodoList } from './todo-list';

const todos: Todo[] = [
  { id: '1', title: 'Buy milk', description: 'two litres', isCompleted: false },
  { id: '2', title: 'Write report', description: null, isCompleted: true },
];

describe('TodoList', () => {
  const notifications = { success: vi.fn(), error: vi.fn() };
  let fixture: ComponentFixture<TodoList>;
  let controller: HttpTestingController;

  beforeEach(() => {
    notifications.success.mockReset();
    TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        TodoService,
        { provide: NotificationService, useValue: notifications },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
  });

  async function render(items: Todo[]): Promise<HTMLElement> {
    fixture = TestBed.createComponent(TodoList);
    fixture.detectChanges();
    controller.expectOne('todos').flush(items);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const rows = (el: HTMLElement) => Array.from(el.querySelectorAll('tbody tr')).map((r) => r.textContent ?? '');

  it('renders a row per todo', async () => {
    const el = await render(todos);

    expect(rows(el)).toHaveLength(2);
    expect(rows(el)[0]).toContain('Buy milk');
    expect(rows(el)[1]).toContain('Write report');
  });

  it('shows the empty state when there are no todos', async () => {
    const el = await render([]);

    expect(el.textContent).toContain('No todos found.');
  });

  it('filters rows by title or description ignoring case', async () => {
    const el = await render(todos);
    const input = el.querySelector('input[type="text"]') as HTMLInputElement;

    input.value = 'LITRES';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(rows(el)).toHaveLength(1);
    expect(rows(el)[0]).toContain('Buy milk');
  });

  const dialog = () => document.querySelector('hlm-alert-dialog-content');
  const dialogButton = (label: string) =>
    Array.from(dialog()?.querySelectorAll('button') ?? []).find((b) => b.textContent?.trim() === label) as HTMLButtonElement;

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function askDelete(el: HTMLElement): Promise<void> {
    (el.querySelector('button[aria-label="Delete"]') as HTMLButtonElement).click();
    await settle();
  }

  it('asks for confirmation before deleting and sends nothing until confirmed', async () => {
    const el = await render(todos);

    await askDelete(el);

    expect(dialog()?.textContent).toContain('Buy milk');
    controller.expectNone('todos/1');
  });

  it('does not delete when the confirmation is declined', async () => {
    const el = await render(todos);
    await askDelete(el);

    dialogButton('Cancel').click();
    await settle();

    controller.expectNone('todos/1');
    expect(rows(el)).toHaveLength(2);
  });

  it('deletes after the confirmation is accepted and notifies', async () => {
    const el = await render(todos);
    await askDelete(el);

    dialogButton('Delete').click();
    controller.expectOne('todos/1').flush(null, { status: 204, statusText: 'No Content' });
    await settle();

    expect(notifications.success).toHaveBeenCalledWith('Todo deleted.');
    expect(rows(el)).toHaveLength(1);
  });

  it('keeps the row and does not report success when delete fails', async () => {
    const el = await render(todos);
    await askDelete(el);

    dialogButton('Delete').click();
    controller.expectOne('todos/1').flush(null, { status: 500, statusText: 'x' });
    await settle();

    expect(notifications.success).not.toHaveBeenCalled();
    expect(rows(el)).toHaveLength(2);
  });

  it('sorts by a column and reverses on the second click', async () => {
    const el = await render(todos);
    const header = () => Array.from(el.querySelectorAll('th button')).find((b) => b.textContent?.includes('Title')) as HTMLButtonElement;

    header().click();
    await settle();
    expect(rows(el)[0]).toContain('Buy milk');

    header().click();
    await settle();
    expect(rows(el)[0]).toContain('Write report');
  });

  it('paginates ten rows per page', async () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ id: String(i), title: `Todo ${String(i).padStart(2, '0')}`, description: null, isCompleted: false }));
    const el = await render(many);

    expect(rows(el)).toHaveLength(10);
    expect(el.querySelector('nav[aria-label="Pagination"]')?.textContent).toContain('Page 1 of 2');

    (Array.from(el.querySelectorAll('nav[aria-label="Pagination"] button')).find((b) => b.textContent?.includes('Next')) as HTMLButtonElement).click();
    await settle();

    expect(rows(el)).toHaveLength(2);
    expect(el.querySelector('nav[aria-label="Pagination"]')?.textContent).toContain('Page 2 of 2');
  });
});
