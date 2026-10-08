import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NAV_ICONS, NAV_ITEMS } from '../../core/navigation/nav-items';
// The one documented exception to "features never import other features": the Dashboard
// reads (never writes) Todo data. It provides its own instance below, so it shares no state.
import { TodoService } from '../feature-template/todos/todo.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmCardImports, HlmSpinner],
  providers: [TodoService, provideIcons(NAV_ICONS)],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly service = inject(TodoService);

  protected readonly total = computed(() => this.service.todos().length);
  protected readonly completed = computed(() => this.service.todos().filter((t) => t.isCompleted).length);
  protected readonly open = computed(() => this.total() - this.completed());

  protected readonly quickLinks = NAV_ITEMS.filter((item) => item.route !== '/');

  constructor() {
    void this.service.load();
  }
}
