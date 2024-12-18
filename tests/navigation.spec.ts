import AllocateWithPage from '@pages/allocateWith';
import LoginPage from '@pages/login';
import { test, expect } from '@playwright/test';

let loginPage: LoginPage;
let allocateWithPage: AllocateWithPage;

test.describe('Navigation and Links', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    allocateWithPage = new AllocateWithPage(page);

    await loginPage.goto();
    await loginPage.cookieConsent.acceptCookies();
    await loginPage.login();
  });

  test('Navigate to the Allocate With - Explore page', async () => {
    await allocateWithPage.header.navigateToSubpage('explore');
  });
});
