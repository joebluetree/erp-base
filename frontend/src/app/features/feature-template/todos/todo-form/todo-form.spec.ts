import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';
import { ApiError } from '../../../../core/errors/api-error';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  const service = { save: vi.fn(), get: vi.fn(), todos: signal<Todo[]>([]) };
  const router = { navigate: vi.fn() };
  const notifications = { success: vi.fn(), error: vi.fn() };
  let fixture: ComponentFixture<TodoForm>;
  let el: HTMLElement;

  async function create(id: string | null = null): Promise<void> {
    TestBed.configureTestingModule({
      imports: [TodoForm],
      providers: [
        { provide: TodoService, useValue: service },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notifications },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } } },
      ],
    });
    fixture = TestBed.createComponent(TodoForm);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    service.save.mockReset().mockResolvedValue({ id: 'new' });
    service.get.mockReset();
    service.todos.set([]);
    router.navigate.mockReset().mockResolvedValue(true);
    notifications.success.mockReset();
    notifications.error.mockReset();
  });

  const title = () => el.querySelector('#title') as HTMLInputElement;
  const description = () => el.querySelector('#description') as HTMLTextAreaElement;
  const errors = () => Array.from(el.querySelectorAll('.field-error')).map((e) => e.textContent?.trim());

  async function type(input: HTMLInputElement | HTMLTextAreaElement, value: string): Promise<void> {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function submit(): Promise<void> {
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('does not send an invalid form and shows the title-required message', async () => {
    await create();

    await submit();

    expect(service.save).not.toHaveBeenCalled();
    expect(errors()).toContain('Title is required.');
  });

  it('rejects a 201-character title but accepts 200', async () => {
    await create();

    await type(title(), 'a'.repeat(201));
    expect(errors()[0]).toContain('at most 200 characters');
    await submit();
    expect(service.save).not.toHaveBeenCalled();

    await type(title(), 'a'.repeat(200));
    expect(errors()).toHaveLength(0);
  });

  it('rejects a description over 2000 characters', async () => {
    await create();
    await type(title(), 'ok');

    await type(description(), 'b'.repeat(2001));

    expect(errors()[0]).toContain('Description must be at most 2000 characters');
  });

  it('creates, notifies and returns to the list', async () => {
    await create();
    await type(title(), 'Buy milk');

    await submit();

    expect(service.save).toHaveBeenCalledWith({ id: null, title: 'Buy milk', description: null, isCompleted: false });
    expect(notifications.success).toHaveBeenCalledWith('Todo created.');
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('edits the existing todo: pre-fills from the server and saves with its id', async () => {
    service.get.mockResolvedValue({ id: '7', title: 'Old', description: 'desc', isCompleted: true });
    await create('7');

    expect(title().value).toBe('Old');
    expect(description().value).toBe('desc');

    await type(title(), 'New');
    await submit();

    expect(service.save).toHaveBeenCalledWith({ id: '7', title: 'New', description: 'desc', isCompleted: true });
    expect(notifications.success).toHaveBeenCalledWith('Todo updated.');
  });

  it('prefers a todo already in state over fetching it', async () => {
    service.todos.set([{ id: '7', title: 'Cached', description: null, isCompleted: false }]);
    await create('7');

    expect(service.get).not.toHaveBeenCalled();
    expect(title().value).toBe('Cached');
  });

  it('goes back to the list when the todo to edit does not exist', async () => {
    service.get.mockRejectedValue({ status: 404, message: 'The item could not be found.' } satisfies ApiError);
    await create('missing');

    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('shows backend field errors next to the field', async () => {
    service.save.mockRejectedValue({
      status: 400,
      message: 'Please correct the highlighted fields.',
      fieldErrors: { title: ['Title already exists.'] },
    } satisfies ApiError);
    await create();
    await type(title(), 'Dup');

    await submit();

    expect(errors()).toContain('Title already exists.');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('reports backend errors for unknown fields in a notification', async () => {
    service.save.mockRejectedValue({
      status: 400,
      message: 'x',
      fieldErrors: { other: ['Something is wrong.'] },
    } satisfies ApiError);
    await create();
    await type(title(), 'x');

    await submit();

    expect(notifications.error).toHaveBeenCalledWith('Something is wrong.');
  });

  it('disables Save while a save is in flight', async () => {
    let finish: (v: unknown) => void = () => undefined;
    service.save.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    await create();
    await type(title(), 'Slow');

    void submit();
    fixture.detectChanges();
    const save = el.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(save.disabled).toBe(true);

    finish({ id: '1' });
    await fixture.whenStable();
  });

  it('cancel link goes to the list without saving', async () => {
    await create();

    const cancel = Array.from(el.querySelectorAll('a')).find((a) => a.textContent?.includes('Cancel'));

    expect(cancel).toBeTruthy();
    expect(service.save).not.toHaveBeenCalled();
  });
});
