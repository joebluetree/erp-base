import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi } from 'vitest';
import { AppNav } from './app-nav';

@Component({ template: '' })
class Blank {}

describe('AppNav', () => {
  const onNavigated = vi.fn();

  @Component({ imports: [AppNav], template: '<app-nav (navigated)="onNavigated()" />' })
  class Host {
    onNavigated = onNavigated;
  }

  async function render(url = '/') {
    onNavigated.mockReset();
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        provideRouter([
          { path: '', pathMatch: 'full', component: Blank },
          { path: 'todos', component: Blank },
          { path: 'todos/new', component: Blank },
        ]),
      ],
    });
    const harness = await RouterTestingHarness.create(url);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { el: fixture.nativeElement as HTMLElement, fixture, harness };
  }

  const links = (el: HTMLElement) => Array.from(el.querySelectorAll('a'));
  const active = (el: HTMLElement) => links(el).filter((a) => a.classList.contains('active')).map((a) => a.textContent?.trim());

  it('lists Dashboard and Todos with icons and links', async () => {
    const { el } = await render();

    expect(links(el).map((a) => a.textContent?.trim())).toEqual(['Dashboard', 'Todos']);
    expect(links(el).map((a) => a.getAttribute('href'))).toEqual(['/', '/todos']);
    expect(el.querySelectorAll('a ng-icon')).toHaveLength(2);
  });

  it('exposes a labelled navigation landmark', async () => {
    const { el } = await render();

    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Main menu');
  });

  it('highlights Dashboard on the root', async () => {
    const { el } = await render('/');

    expect(active(el)).toEqual(['Dashboard']);
  });

  it('highlights Todos, not Dashboard, on the Todo list', async () => {
    const { el } = await render('/todos');

    expect(active(el)).toEqual(['Todos']);
  });

  it('keeps Todos highlighted on a page under it', async () => {
    const { el } = await render('/todos/new');

    expect(active(el)).toEqual(['Todos']);
  });

  it('updates the highlight when navigating', async () => {
    const { el, fixture } = await render('/');

    await TestBed.inject(Router).navigateByUrl('/todos');
    fixture.detectChanges();

    expect(active(el)).toEqual(['Todos']);
  });

  it('emits navigated when an entry is chosen', async () => {
    const { el } = await render('/');

    links(el)[1].click();

    expect(onNavigated).toHaveBeenCalledOnce();
  });
});
