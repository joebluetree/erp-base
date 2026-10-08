import { NAV_ICONS, NAV_ITEMS } from './nav-items';

describe('NAV_ITEMS', () => {
  it('starts with the Dashboard and its destination', () => {
    expect(NAV_ITEMS.map((i) => [i.label, i.route])).toEqual([['Dashboard', '/']]);
  });

  it('gives every entry an icon that is registered in NAV_ICONS', () => {
    expect(NAV_ITEMS.every((i) => i.icon in NAV_ICONS)).toBe(true);
  });

  it('has unique destinations', () => {
    expect(new Set(NAV_ITEMS.map((i) => i.route)).size).toBe(NAV_ITEMS.length);
  });
});
