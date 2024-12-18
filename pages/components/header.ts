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

  constructor(page: Page, parentRoute: string) {
    this.page = page;
    this.parentRoute = parentRoute;
    this.navMenu = page.locator('#downshift-0-menu');
    this.navMenuCurrent = this.navMenu.locator('#downshift-0-toggle-button');
    this.subpageLink = page.getByTestId(/nav-link-header-[a-z]+-link/);
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
}
