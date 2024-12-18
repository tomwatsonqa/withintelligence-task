import { type Locator, type Page, expect } from '@playwright/test';

// I've only included the subpages that are actively involved in these tests, this would be
// expanded if the test suite was more comprehensive
type Subpage = 'insights' | 'explore';

export default class HeaderComponent {
  readonly page: Page;
  readonly parentRoute: string;
  readonly navMenu: Locator;
  readonly navMenuCurrent: Locator;
  readonly subpageLink: Locator;
  readonly searchBox: Locator;
  readonly insightsSearchResults: Locator;
  readonly insightsSearchResultItem: Locator;

  constructor(page: Page, parentRoute: string) {
    this.page = page;
    this.parentRoute = parentRoute;
    this.navMenu = page.locator('#downshift-0-menu');
    this.navMenuCurrent = this.navMenu.locator('#downshift-0-toggle-button');
    this.subpageLink = page.getByTestId(/nav-link-header-[a-z]+-link/);
    this.searchBox = page.getByPlaceholder(/^search$/i);
    this.insightsSearchResults = page.getByTestId('tabsHandlers-tabPanel-insightsResults');
    this.insightsSearchResultItem = this.insightsSearchResults.getByTestId('search-card-wrapper');
  }

  async navigateToSubpage(subpage: Subpage) {
    /**
     * Navigates the user to one of the subpage links in the header
     *
     * @param subpage - The name of the subpage to navigate to
     */
    const link = this.subpageLink.filter({ hasText: new RegExp(subpage, 'i') });
    await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
    await link.click();
    await expect(link).toHaveCSS('color', 'rgb(130, 247, 196)');

    // Explore is the only link where the route has a different name, hence the conditional
    const urlRegex = new RegExp(`${this.parentRoute}/${subpage === 'explore' ? 'discover' : subpage}$`);
    expect(this.page.url()).toMatch(urlRegex);
  }

  async getInsightsSearchResults(input: string) {
    /**
     * Takes in search input and returns an array of search results
     *
     * @param input - Search term
     *
     * @returns Array of search results
     */

    const searchResponse = this.page.waitForResponse(async (res) => {
      const req = res.request();
      return /\/graphql$/.test(res.url()) && req.postDataJSON().operationName === 'SearchIntel';
    });

    await this.searchBox.fill(input);

    // Wait for the results to be pulled from the API before continuing
    await searchResponse;

    expect(await this.insightsSearchResults.textContent()).toMatch(
      new RegExp(`Displaying results for '${input}'`, 'i')
    );

    const results = await this.insightsSearchResultItem.all();
    return results;
  }
}
