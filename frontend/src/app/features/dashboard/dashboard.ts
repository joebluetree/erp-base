import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NAV_ICONS, NAV_MENU } from '../../core/navigation/nav-items';

/** Landing page: a welcome and quick links to the other menu entries. It shows no data and calls no backend. */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons(NAV_ICONS)],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly quickLinks = inject(NAV_MENU).filter((item) => item.route !== '/');
}
