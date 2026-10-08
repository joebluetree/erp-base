import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ierp-theme';

/**
 * Light/dark theme. The initial theme is the stored choice, else the operating system's preference,
 * else light. The theme is applied as a `dark` class on `<html>` (which the generated Spartan theme
 * variables and Tailwind's `dark:` variant key on). `index.html` runs the same rule before the app
 * starts so the first paint is already correct.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  private readonly themeState = signal<Theme>(this.initialTheme());
  readonly theme = this.themeState.asReadonly();

  constructor() {
    this.apply(this.themeState());
  }

  toggle(): void {
    this.set(this.themeState() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.themeState.set(theme);
    this.apply(theme);
    this.store(theme);
  }

  private initialTheme(): Theme {
    const stored = this.readStored();
    if (stored) {
      return stored;
    }
    const prefersDark = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
  }

  private readStored(): Theme | null {
    try {
      const value = this.doc.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null; // storage blocked: the choice just is not remembered
    }
  }

  private store(theme: Theme): void {
    try {
      this.doc.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage blocked: the switch still works for this visit
    }
  }

  private apply(theme: Theme): void {
    const root = this.doc.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }
}
