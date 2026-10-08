import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NAV_ITEMS, NAV_MENU } from '../core/navigation/nav-items';
import { Shell } from './shell';

@Component({ template: '<p id="page-body">Page body</p>' })
class PageStub {}

describe('Shell', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  async function render() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NAV_MENU, useValue: [...NAV_ITEMS, { label: 'Reports', icon: 'lucideHouse', route: '/reports' }] },
        provideRouter([
          {
            path: '',
            component: Shell,
            children: [
              { path: '', pathMatch: 'full', component: PageStub },
              { path: 'reports', component: PageStub },
            ],
          },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create('/');
    const el = harness.routeNativeElement as HTMLElement;
    return { harness, el };
  }

  const menuButton = (el: HTMLElement) => el.querySelector('button[aria-label="Open menu"]') as HTMLButtonElement;
  const drawerNav = () => document.querySelector('hlm-sheet-content app-nav');

  async function settle(harness: RouterTestingHarness) {
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  it('shows the header with the app name, the sidebar menu and the routed page', async () => {
    const { el } = await render();

    expect(el.querySelector('header')?.textContent).toContain('iErp');
    expect(el.querySelector('aside app-nav a')).toBeTruthy();
    expect(el.querySelector('main #page-body')?.textContent).toBe('Page body');
  });

  it('has no user menu in the header', async () => {
    const { el } = await render();

    const labels = Array.from(el.querySelectorAll('header button')).map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual(['Open menu', 'Switch to dark theme']);
  });

  const themeButton = (el: HTMLElement) => el.querySelector('header button[aria-label^="Switch to"]') as HTMLButtonElement;

  it('has a theme button whose name states the action', async () => {
    const { el } = await render();

    expect(themeButton(el).getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('switches to dark and back, updating the name and the page theme', async () => {
    const { harness, el } = await render();

    themeButton(el).click();
    await settle(harness);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(themeButton(el).getAttribute('aria-label')).toBe('Switch to light theme');

    themeButton(el).click();
    await settle(harness);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(themeButton(el).getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('remembers the chosen theme', async () => {
    const { harness, el } = await render();

    themeButton(el).click();
    await settle(harness);

    expect(localStorage.getItem('ierp-theme')).toBe('dark');
  });

  it('is reachable from the keyboard as a real button', async () => {
    const { el } = await render();

    expect(themeButton(el).tagName).toBe('BUTTON');
    expect(themeButton(el).tabIndex).toBe(0);
  });

  it('gives the header menu button an accessible name', async () => {
    const { el } = await render();

    expect(menuButton(el)).toBeTruthy();
  });

  it('opens the overlay menu from the header button', async () => {
    const { harness, el } = await render();
    expect(drawerNav()).toBeNull();

    menuButton(el).click();
    await settle(harness);

    expect(drawerNav()).not.toBeNull();
  });

  it('closes the overlay after an entry is chosen and shows that page', async () => {
    const { harness, el } = await render();
    menuButton(el).click();
    await settle(harness);

    (drawerNav()?.querySelector('a[href="/reports"]') as HTMLAnchorElement).click();
    await settle(harness);
    await new Promise((resolve) => setTimeout(resolve, 400));
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/reports');
    expect(drawerNav()).toBeNull();
  });

  it('closes the overlay when it is dismissed without choosing', async () => {
    const { harness, el } = await render();
    menuButton(el).click();
    await settle(harness);

    const close = Array.from(document.querySelectorAll('hlm-sheet-content button')).find((b) => b.textContent?.includes('Close'));
    (close as HTMLElement).click();
    await settle(harness);
    await new Promise((resolve) => setTimeout(resolve, 400));
    harness.detectChanges();

    expect(drawerNav()).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/');
  });
});
