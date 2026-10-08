import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { RouterOutlet } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { ThemeService } from '../core/theme/theme.service';
import { AppNav } from './app-nav';

/**
 * The frame around every page: header, sidebar and content area.
 * At 768px and wider (Tailwind `md`) the sidebar sits beside the content; below that it opens as a sheet.
 * The header also holds the light/dark theme switch.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NgIcon, HlmButtonImports, HlmSheetImports, AppNav],
  providers: [provideIcons({ lucideMenu, lucideMoon, lucideSun })],
  templateUrl: './shell.html',
})
export class Shell {
  private readonly themeService = inject(ThemeService);

  protected readonly menuOpen = signal(false);

  /** The icon shows the theme the user will switch to. */
  protected readonly themeIcon = computed(() => (this.themeService.theme() === 'dark' ? 'lucideSun' : 'lucideMoon'));
  protected readonly themeLabel = computed(() =>
    this.themeService.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
