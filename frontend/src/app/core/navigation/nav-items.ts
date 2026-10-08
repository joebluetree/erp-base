import { InjectionToken } from '@angular/core';
import { lucideHouse } from '@ng-icons/lucide';

/** One entry in the main navigation menu. */
export interface NavItem {
  label: string;
  /** Name of an icon registered in `NAV_ICONS`, e.g. `lucideHouse`. */
  icon: string;
  /** Router destination. `/` is matched exactly; others also match their child routes. */
  route: string;
}

/** Icons used by `NAV_ITEMS`. Components that show the items register these with `provideIcons`. */
export const NAV_ICONS = { lucideHouse };

/**
 * The single list that drives the sidebar menu and the Dashboard quick links.
 * To add an ERP module's screen: add one item here (and its icon to `NAV_ICONS`) and its route in `app.routes.ts`.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', icon: 'lucideHouse', route: '/' },
];

/** The menu as injected into components. Defaults to `NAV_ITEMS`; tests can provide a different list. */
export const NAV_MENU = new InjectionToken<readonly NavItem[]>('NAV_MENU', {
  providedIn: 'root',
  factory: () => NAV_ITEMS,
});
