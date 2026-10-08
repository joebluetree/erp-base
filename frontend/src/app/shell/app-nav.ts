import { Component, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ICONS, NAV_ITEMS } from '../core/navigation/nav-items';

/** The navigation menu. Used in the desktop sidebar and inside the mobile sheet. */
@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons(NAV_ICONS)],
  template: `
    <nav aria-label="Main menu">
      <ul class="grid gap-1 p-2">
        @for (item of items; track item.route) {
          <li>
            <a
              class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              [routerLink]="item.route"
              routerLinkActive="active bg-accent font-semibold text-accent-foreground"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              (click)="navigated.emit()"
            >
              <ng-icon [name]="item.icon" class="text-base" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class AppNav {
  protected readonly items = NAV_ITEMS;

  /** Emitted when the user chooses an entry, so the mobile sheet can close. */
  readonly navigated = output<void>();
}
