import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SERVER_ERROR_MESSAGE, isApiError } from '../../../core/errors/api-error';
import { Todo, TodoSaveRequest } from './todo.model';

/**
 * Talks to the backend Todo API and owns the Todo list state.
 * Provided by the Todo routes, so the state lives and dies with the feature.
 * Failed requests are already reported to the user by the HTTP error interceptor.
 */
@Injectable()
export class TodoService {
  private readonly http = inject(HttpClient);

  private readonly todosState = signal<Todo[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly todos = this.todosState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /** Loads the list. A failure is kept in `error` rather than thrown. */
  async load(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      this.todosState.set(await firstValueFrom(this.http.get<Todo[]>('todos')));
    } catch (e) {
      this.errorState.set(isApiError(e) ? e.message : SERVER_ERROR_MESSAGE);
    } finally {
      this.loadingState.set(false);
    }
  }

  get(id: string): Promise<Todo> {
    return firstValueFrom(this.http.get<Todo>(`todos/${id}`));
  }

  /** Creates (no `id`) or updates (with `id`) through the single backend save endpoint. */
  async save(request: TodoSaveRequest): Promise<Todo> {
    const saved = await firstValueFrom(this.http.post<Todo>('todos', request));
    this.todosState.update((list) =>
      list.some((t) => t.id === saved.id)
        ? list.map((t) => (t.id === saved.id ? saved : t))
        : [...list, saved],
    );
    return saved;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`todos/${id}`));
    this.todosState.update((list) => list.filter((t) => t.id !== id));
  }
}
