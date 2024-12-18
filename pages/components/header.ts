import { type Locator, type Page } from '@playwright/test';

export default class HeaderComponent {
  readonly page: Page;
  readonly navMenu: Locator;
  readonly navMenuCurrent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navMenu = page.locator('#downshift-0-menu');
    this.navMenuCurrent = this.navMenu.locator('#downshift-0-toggle-button');
  }
}
