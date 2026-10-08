import { Routes } from '@angular/router';
import { TodoService } from './todo.service';

export const TODO_ROUTES: Routes = [
  {
    path: '',
    providers: [TodoService],
    children: [
      {
        path: '',
        loadComponent: () => import('./todo-list/todo-list').then((m) => m.TodoList),
      },
      {
        path: 'new',
        loadComponent: () => import('./todo-form/todo-form').then((m) => m.TodoForm),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./todo-form/todo-form').then((m) => m.TodoForm),
      },
    ],
  },
];
