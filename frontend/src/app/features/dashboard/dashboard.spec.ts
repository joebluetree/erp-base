import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NAV_ITEMS, NAV_MENU } from '../../core/navigation/nav-items';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  function create(extraEntries: boolean) {
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        ...(extraEntries
          ? [{ provide: NAV_MENU, useValue: [...NAV_ITEMS, { label: 'Reports', icon: 'lucideHouse', route: '/reports' }] }]
          : []),
      ],
    });
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows a heading and a welcome text', () => {
    const { el } = create(false);

    expect(el.querySelector('h1')?.textContent).toContain('Dashboard');
    expect(el.textContent).toContain('Welcome to iErp');
  });

  it('shows no quick-links section while the menu has only the Dashboard', () => {
    const { el } = create(false);

    expect(el.querySelector('.quick-links')).toBeNull();
    expect(el.textContent).not.toContain('Quick links');
  });

  it('shows a quick link for each other menu entry, and not for the Dashboard itself', () => {
    const { el } = create(true);

    const links = Array.from(el.querySelectorAll('.quick-links a')).map((a) => [a.textContent?.trim(), a.getAttribute('href')]);
    expect(links).toEqual([['Reports', '/reports']]);
  });

  it('sends no backend requests', () => {
    create(true);

    TestBed.inject(HttpTestingController).expectNone(() => true);
  });
});
