import { type Page } from '@playwright/test';
import BaseSectionPage from './baseSection';

export default class AllocateWithPage extends BaseSectionPage {
  readonly page: Page;
  readonly route: string;
  readonly name: string | RegExp;

  constructor(page: Page) {
    const route = '/all';
    const name = /allocate with/i;

    super(page, route, name);
    this.page = page;
    this.route = route;
    this.name = name;
  }
}
