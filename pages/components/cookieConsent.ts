import { type Locator, type Page } from '@playwright/test';
import { expect } from 'fixtures';

export default class CookieConsentComponent {
  readonly page: Page;
  readonly popup: Locator;
  readonly acceptButton: Locator;
  readonly rejectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popup = page.getByRole('alertdialog', { name: 'Privacy' });
    this.acceptButton = this.popup.getByRole('button', { name: /Reject All/i });
    this.rejectButton = this.popup.getByRole('button', { name: /Accept All Cookies/i });
  }

  async acceptCookies() {
    await this.acceptButton.click();
    await expect(this.popup).not.toBeVisible();
  }

  async rejectCookies() {
    await this.rejectButton.click();
    await expect(this.popup).not.toBeVisible();
  }
}
