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
      {
        path: 'todos',
        loadChildren: () =>
          import('./features/feature-template/todos/todo.routes').then((m) => m.TODO_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
