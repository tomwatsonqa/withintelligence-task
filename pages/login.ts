import { expect, type Locator, type Page } from '@playwright/test';
import CookieConsentComponent from './components/cookieConsent';

export default class LoginPage {
  readonly page: Page;
  readonly route: string;
  readonly cookieConsent: CookieConsentComponent;
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly invalidCredentialsAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.route = '/login';
    this.cookieConsent = new CookieConsentComponent(page);
    this.loginForm = page.locator('#login-form');
    this.emailInput = this.loginForm.getByRole('textbox', { name: /email/i });
    this.passwordInput = this.loginForm.getByRole('textbox', { name: /password/i });
    this.signInButton = this.loginForm.getByRole('button', { name: /sign in/i });
    this.invalidCredentialsAlert = this.loginForm.getByTestId('login-errorMessage');
  }

  async goto() {
    /**
     * Routes the user to the login page
     */
    await this.page.goto(this.route);
    await expect(this.emailInput).toBeVisible();
  }

  async login({
    username = process.env.USERNAME,
    password = process.env.PASSWORD
  }: { username?: string; password?: string } = {}) {
    /**
     * Attempts to log the user in to the website; defaulting to credentials stored
     * in .env unless otherwise passed.
     *
     * @param username - The users email
     * @param password - The users password
     *
     * @returns The authentication request and response objects
     */

    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);

    const authRequest = this.page.waitForRequest(
      async (req) => /\/graphql$/.test(req.url()) && req.postDataJSON().operationName === 'Authenticate'
    );

    await this.signInButton.click();

    const request = await authRequest;

    // Validate that the correct credentials are sent in the authentication request
    //
    // NOTE: This could potentially be extracted out into a seperate test case, rather than running the
    // assertion every time the login() function is called.
    const { username: reqUsername, password: reqPassword } = request.postDataJSON().variables;
    expect(reqUsername).toEqual(username);
    expect(reqPassword).toEqual(password);

    const response = await request.response();

    return { request, response };
  }
}
