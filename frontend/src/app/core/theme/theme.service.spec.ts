import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = document.documentElement;
  const originalMatchMedia = window.matchMedia;

  function systemPrefersDark(dark: boolean): void {
    window.matchMedia = vi.fn().mockReturnValue({ matches: dark }) as unknown as typeof window.matchMedia;
  }

  function create(): ThemeService {
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    localStorage.clear();
    root.classList.remove('dark');
    root.style.colorScheme = '';
    (window as { matchMedia?: unknown }).matchMedia = undefined;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('defaults to light with nothing stored and no system preference', () => {
    const service = create();

    expect(service.theme()).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.style.colorScheme).toBe('light');
  });

  it('follows a dark system preference on the first visit', () => {
    systemPrefersDark(true);

    expect(create().theme()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('is light when the system has no dark preference', () => {
    systemPrefersDark(false);

    expect(create().theme()).toBe('light');
  });

  it('prefers the stored choice over the system preference', () => {
    systemPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    expect(create().theme()).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
  });

  it('ignores an invalid stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');

    expect(create().theme()).toBe('light');
  });

  it('toggles between light and dark, applying the class and color scheme', () => {
    const service = create();

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
    expect(root.style.colorScheme).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.style.colorScheme).toBe('light');
  });

  it('remembers the choice for the next visit', () => {
    create().toggle();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    TestBed.resetTestingModule();
    root.classList.remove('dark');

    expect(create().theme()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
  });

  it('still switches when storage cannot be read or written', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const service = create();
    expect(service.theme()).toBe('light');

    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(root.classList.contains('dark')).toBe(true);
  });
});
