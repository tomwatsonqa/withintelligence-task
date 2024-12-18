import { expect, type Page } from '@playwright/test';
import HeaderComponent from './components/header';

export default class AllocateWithPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly route: string;

  constructor(page: Page) {
    this.page = page;
    this.route = '/all';
    this.header = new HeaderComponent(page, this.route);
  }

  async goto() {
    /**
     * Routes the user to the Allocate With page
     */
    await this.page.goto(this.route);
    expect(await this.header.navMenuCurrent.textContent()).toMatch(/^allocate with$/i);
  }
}
