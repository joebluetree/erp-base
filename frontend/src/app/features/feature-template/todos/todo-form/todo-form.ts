import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { isApiError } from '../../../../core/errors/api-error';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../todo.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmInputImports,
    HlmLabelImports,
    HlmTextareaImports,
  ],
  templateUrl: './todo-form.html',
})
export class TodoForm {
  private readonly service = inject(TodoService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)]],
    description: ['', [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
    isCompleted: [false],
  });

  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly saving = signal(false);

  constructor() {
    if (this.id) {
      void this.loadForEdit(this.id);
    }
  }

  /** Message for the first error on a control, once it has been touched. */
  protected errorFor(name: 'title' | 'description'): string | null {
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) {
      return null;
    }
    const label = name === 'title' ? 'Title' : 'Description';
    if (control.errors['required']) {
      return `${label} is required.`;
    }
    if (control.errors['maxlength']) {
      return `${label} must be at most ${control.errors['maxlength'].requiredLength} characters.`;
    }
    return (control.errors['server'] as string | undefined) ?? null;
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, description, isCompleted } = this.form.getRawValue();
    this.saving.set(true);
    try {
      await this.service.save({
        id: this.id,
        title,
        description: description || null,
        isCompleted,
      });
      this.notifications.success(this.id ? 'Todo updated.' : 'Todo created.');
      await this.router.navigate(['/todos']);
    } catch (e) {
      if (isApiError(e) && e.fieldErrors) {
        this.showServerErrors(e.fieldErrors);
      }
    } finally {
      this.saving.set(false);
    }
  }

  private showServerErrors(fieldErrors: Record<string, string[]>): void {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      const control = this.form.get(field);
      if (control) {
        control.setErrors({ server: messages[0] });
        control.markAsTouched();
      } else {
        messages.forEach((m) => this.notifications.error(m));
      }
    }
  }

  private async loadForEdit(id: string): Promise<void> {
    try {
      const todo = this.service.todos().find((t) => t.id === id) ?? (await this.service.get(id));
      this.form.patchValue({
        title: todo.title,
        description: todo.description ?? '',
        isCompleted: todo.isCompleted,
      });
    } catch {
      // Already reported by the HTTP error interceptor.
      await this.router.navigate(['/todos']);
    }
  }
}
