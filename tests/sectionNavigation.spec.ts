import AllocateWithPage from '@pages/allocateWith';
import LoginPage from '@pages/login';
import PrivateCreditPage from '@pages/privateCredit';
import { test } from '@playwright/test';

let loginPage: LoginPage;
let allocateWithPage: AllocateWithPage;
let privateCreditPage: PrivateCreditPage;

test.describe('Section Navigation', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    allocateWithPage = new AllocateWithPage(page);
    privateCreditPage = new PrivateCreditPage(page);

    // NOTE: I would probably abstract this flow out into a simple fixture, to make the initial login
    // step easier to implement for every test (since almost every test will require it)
    await loginPage.goto();
    await loginPage.cookieConsent.acceptCookies();
    await loginPage.login();
  });

  test('Navigate to the Private Credit section', async () => {
    await allocateWithPage.header.navigateToSection('private credit');
    await privateCreditPage.assertPageLoaded();
  });
});
