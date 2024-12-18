import { expect, type Page } from '@playwright/test';
import HeaderComponent from './components/header';

export default class PrivateCreditPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly route: string;

  constructor(page: Page) {
    this.page = page;
    this.route = '/pcfi';
    this.header = new HeaderComponent(page, this.route);
  }

  async goto() {
    /**
     * Routes the user to the Allocate With page
     */
    await this.page.goto(this.route);
    expect(await this.header.navMenuCurrent.textContent()).toMatch(/^private credit$/i);
  }

  async assertPageLoaded() {
    /**
     * Asserts that this page has loaded
     */
    expect(await this.header.navMenuCurrent.textContent()).toMatch(/^private credit$/i);
    expect(this.page.url()).toMatch(new RegExp(`${this.route}/[a-z]+$`, 'i'));
  }
}
