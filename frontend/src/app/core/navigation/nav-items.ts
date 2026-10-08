import { lucideHouse, lucideSquareCheck } from '@ng-icons/lucide';

/** One entry in the main navigation menu. */
export interface NavItem {
  label: string;
  /** Name of an icon registered in `NAV_ICONS`, e.g. `lucideHouse`. */
  icon: string;
  /** Router destination. `/` is matched exactly; others also match their child routes. */
  route: string;
}

/** Icons used by `NAV_ITEMS`. Components that show the items register these with `provideIcons`. */
export const NAV_ICONS = { lucideHouse, lucideSquareCheck };

/**
 * The single list that drives the sidebar menu and the Dashboard quick links.
 * To add an ERP module's screen: add one item here (and its icon to `NAV_ICONS`) and its route in `app.routes.ts`.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', icon: 'lucideHouse', route: '/' },
  { label: 'Todos', icon: 'lucideSquareCheck', route: '/todos' },
];
