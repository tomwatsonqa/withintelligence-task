import AllocateWithPage from '@pages/allocateWith';
import LoginPage from '@pages/login';
import { test, expect } from '@playwright/test';

let loginPage: LoginPage;
let allocateWithPage: AllocateWithPage;

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    allocateWithPage = new AllocateWithPage(page);

    await loginPage.goto();
    await loginPage.cookieConsent.acceptCookies();
  });

  test('Valid Credentials', async ({ page, baseURL }) => {
    const { response } = await loginPage.login();

    // NOTE: It would likely be more efficient to test this on the API layer
    expect(response).toBeTruthy();
    const {
      data: { authenticate }
    } = await response!.json();
    expect(authenticate.accessToken).toBeTruthy();
    expect(authenticate.hfaAccessToken).toBeTruthy();
    expect(authenticate.accountEmail).toEqual(process.env.USERNAME);

    await allocateWithPage.assertPageLoaded();
  });

  test('Invalid Credentials', async ({ page, baseURL }) => {
    const username = 'test@test.com';
    const password = 'Testing123!';
    const { response } = await loginPage.login({ username, password });

    // NOTE: It would likely be more efficient to test this on the API layer
    expect(response).toBeTruthy();
    const body = await response!.json();
    const error = body.errors[0];
    expect(error.message).toEqual('403: Forbidden');

    await expect(loginPage.invalidCredentialsAlert).toBeVisible();
    // Case-insensitive regex is used here to eliminate any false fails if the text casing is changed
    // through styling (e.g. if a design decision is made to capitalise it)
    expect(await loginPage.invalidCredentialsAlert.textContent()).toMatch(
      /We didn't recognize the username or password you entered\. Please try again or click here to reset your password\./i
    );

    // Test to ensure the user remains on the login route
    expect(page.url()).toEqual(`${baseURL}${loginPage.route}`);
  });
});
