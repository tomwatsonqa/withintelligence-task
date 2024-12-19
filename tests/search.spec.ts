import AllocateWithPage from '@pages/allocateWith';
import LoginPage from '@pages/login';
import { test, expect } from '@playwright/test';

let loginPage: LoginPage;
let allocateWithPage: AllocateWithPage;

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    allocateWithPage = new AllocateWithPage(page);

    // NOTE: I would probably abstract this flow out into a simple fixture, to make the initial login
    // step easier to implement for every test (since almost every test will require it)
    await loginPage.goto();
    await loginPage.cookieConsent.acceptCookies();
    await loginPage.login();
  });

  test('Valid Search Query', async () => {
    const searchTerm = 'investors';
    const results = await allocateWithPage.header.getInsightsSearchResults(searchTerm);

    // NOTE: It would also be a good idea here to cross check the results recieved via graphql
    // with the results rendered on the front-end, to make sure nothing is missing
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  test('No Search Results', async () => {
    const searchTerm = 'absolutenonsensetestinput';
    const results = await allocateWithPage.header.getInsightsSearchResults(searchTerm);

    expect(results).toHaveLength(0);
    expect(await allocateWithPage.header.insightsSearchResults.textContent()).toMatch(
      new RegExp(`Your search for '${searchTerm}' did not match any documents.`, 'i')
    );
  });
});
