import { type Page } from '@playwright/test';
import BaseSectionPage from './baseSection';

export default class PrivateCreditPage extends BaseSectionPage {
  readonly page: Page;
  readonly route: string;
  readonly name: string | RegExp;

  constructor(page: Page) {
    const route = '/pcfi';
    const name = /private credit/i;

    super(page, route, name);
    this.page = page;
    this.route = route;
    this.name = name;
  }
}
