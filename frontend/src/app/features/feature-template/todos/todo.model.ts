/** Mirrors the backend `TodoResponse`. */
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
}

/** Mirrors the backend `TodoSaveRequest`. `id` is null to create, set to update. */
export interface TodoSaveRequest {
  id: string | null;
  title: string;
  description: string | null;
  isCompleted: boolean;
}

export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 2000;
