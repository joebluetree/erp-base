import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucidePencil, lucidePlus, lucideSearch, lucideTrash2 } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';

type SortField = 'title' | 'description' | 'isCompleted';

export const PAGE_SIZE = 10;

@Component({
  selector: 'app-todo-list',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertDialogImports,
    HlmButtonImports,
    HlmInputImports,
    HlmSpinner,
    HlmTableImports,
  ],
  providers: [
    provideIcons({ lucideArrowDown, lucideArrowUp, lucidePencil, lucidePlus, lucideSearch, lucideTrash2 }),
  ],
  templateUrl: './todo-list.html',
})
export class TodoList {
  protected readonly service = inject(TodoService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = viewChild(HlmAlertDialog);

  protected readonly columns: { field: SortField; label: string }[] = [
    { field: 'title', label: 'Title' },
    { field: 'description', label: 'Description' },
    { field: 'isCompleted', label: 'Completed' },
  ];

  protected readonly search = signal('');
  protected readonly sortField = signal<SortField | null>(null);
  protected readonly sortAscending = signal(true);
  protected readonly pageIndex = signal(0);
  protected readonly deleteTarget = signal<Todo | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const todos = this.service.todos();
    if (!term) {
      return todos;
    }
    return todos.filter(
      (t) =>
        t.title.toLowerCase().includes(term) || (t.description ?? '').toLowerCase().includes(term),
    );
  });

  protected readonly sorted = computed(() => {
    const field = this.sortField();
    const rows = [...this.filtered()];
    if (!field) {
      return rows;
    }
    const direction = this.sortAscending() ? 1 : -1;
    return rows.sort((a, b) => {
      const left = a[field] ?? '';
      const right = b[field] ?? '';
      return (left < right ? -1 : left > right ? 1 : 0) * direction;
    });
  });

  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.sorted().length / PAGE_SIZE)));

  protected readonly page = computed(() => {
    const start = Math.min(this.pageIndex(), this.pageCount() - 1) * PAGE_SIZE;
    return this.sorted().slice(start, start + PAGE_SIZE);
  });

  protected readonly currentPage = computed(() => Math.min(this.pageIndex(), this.pageCount() - 1) + 1);

  constructor() {
    void this.service.load();
  }

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  protected sortBy(field: SortField): void {
    if (this.sortField() === field) {
      this.sortAscending.update((ascending) => !ascending);
    } else {
      this.sortField.set(field);
      this.sortAscending.set(true);
    }
  }

  protected ariaSort(field: SortField): 'ascending' | 'descending' | 'none' {
    if (this.sortField() !== field) {
      return 'none';
    }
    return this.sortAscending() ? 'ascending' : 'descending';
  }

  protected goTo(page: number): void {
    this.pageIndex.set(Math.max(0, Math.min(page, this.pageCount() - 1)));
  }

  protected askDelete(todo: Todo): void {
    this.deleteTarget.set(todo);
    this.dialog()?.open();
  }

  protected async confirmDelete(): Promise<void> {
    const todo = this.deleteTarget();
    this.dialog()?.close();
    this.deleteTarget.set(null);
    if (!todo) {
      return;
    }
    try {
      await this.service.remove(todo.id);
      this.notifications.success('Todo deleted.');
    } catch {
      // Already reported by the HTTP error interceptor; the todo stays in the list.
    }
  }

  protected cancelDelete(): void {
    this.deleteTarget.set(null);
  }
}
