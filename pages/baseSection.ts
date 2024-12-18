import { expect, type Page } from '@playwright/test';
import HeaderComponent from './components/header';

export default class BaseSectionPage {
  readonly page: Page;
  readonly route: string;
  readonly name: string | RegExp;
  readonly header: HeaderComponent;

  constructor(page: Page, route: string, name: string | RegExp) {
    this.page = page;
    this.route = route;
    this.name = name;
    this.header = new HeaderComponent(page, this.route);
  }

  async goto() {
    /**
     * Routes the user to the Allocate With page
     */
    await this.page.goto(this.route);
    expect(await this.header.navMenuCurrent.textContent()).toMatch(this.name);
  }

  async assertPageLoaded() {
    /**
     * Asserts that this page has loaded
     */
    expect(await this.header.navMenuCurrent.textContent()).toMatch(this.name);
    expect(this.page.url()).toMatch(new RegExp(`${this.route}/[a-z]+$`, 'i'));
  }
}
