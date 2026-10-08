import { Routes } from '@angular/router';
import { Shell } from './shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      // Feature routes are added here as lazy children, e.g.
      // { path: 'customers', loadChildren: () => import('./features/.../customers.routes').then((m) => m.CUSTOMER_ROUTES) },
    ],
  },
  { path: '**', redirectTo: '' },
];
