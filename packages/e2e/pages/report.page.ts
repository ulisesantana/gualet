import {expect, Locator, Page} from '@playwright/test';

export class ReportPage {
  readonly page: Page;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly getReportButton: Locator;
  readonly balanceText: Locator;
  readonly incomeSection: Locator;
  readonly outcomeSection: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fromDateInput = page.locator('#fromDate');
    this.toDateInput = page.locator('#toDate');
    this.getReportButton = page.getByRole('button', { name: /get report/i });
    // Balance text no longer has .balance class after Chakra migration
    this.balanceText = page.getByText(/Balance for transactions between/i);
    this.incomeSection = page.getByRole('button', { name: /^Income:/i });
    this.outcomeSection = page.getByRole('button', { name: /^Outcome:/i });
    this.noDataMessage = page.getByText('No data');
  }

  async goto() {
    await this.page.goto('/reports');
    await this.page.waitForLoadState('networkidle');

    // Wait for initial report to load (it fetches on mount)
    await expect(this.balanceText).toBeVisible({ timeout: 10000 });
  }

  async setDateRange(from: string, to: string) {
    // Set values using evaluate to ensure React detects the change
    await this.fromDateInput.evaluate((el: HTMLInputElement, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, from);

    await this.toDateInput.evaluate((el: HTMLInputElement, value) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, to);

    // Small wait to ensure state updates
    await this.page.waitForTimeout(200);
  }

  async submitReport() {
    // Wait for button to be enabled (not loading)
    await expect(this.getReportButton).toBeEnabled();
    await this.getReportButton.click();

    // Wait for the loading state to complete
    await expect(this.getReportButton).toHaveText(/get report/i, { timeout: 10000 });

    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
  }

  async verifyBalanceIsVisible() {
    await expect(this.balanceText).toBeVisible();
  }

  async verifyBalanceAmount(expectedAmount: number) {
    const balanceText = await this.balanceText.textContent();
    expect(balanceText).toContain(expectedAmount.toString());
  }

  async verifyIncomeTotal(expectedTotal: number) {
    await expect(this.incomeSection).toBeVisible();
    const incomeText = await this.incomeSection.textContent();
    expect(incomeText).toContain(expectedTotal.toString());
  }

  async verifyOutcomeTotal(expectedTotal: number) {
    await expect(this.outcomeSection).toBeVisible();
    const outcomeText = await this.outcomeSection.textContent();
    expect(outcomeText).toContain(expectedTotal.toString());
  }

  async verifyNoDataMessageVisible() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async verifyIncomeSectionNotVisible() {
    await expect(this.incomeSection).not.toBeVisible();
  }

  async verifyOutcomeSectionNotVisible() {
    await expect(this.outcomeSection).not.toBeVisible();
  }

  async expandIncomeSection() {
    await this.incomeSection.click();
  }

  async expandOutcomeSection() {
    await this.outcomeSection.click();
  }

  async verifyCategoryInList(categoryName: string, total: number) {
    const categoryItem = this.page.getByText(`${categoryName}: ${total}`);
    await expect(categoryItem).toBeVisible();
  }

  async verifyDateRange(from: string, to: string) {
    const balanceText = await this.balanceText.textContent();
    expect(balanceText).toContain(from);
    expect(balanceText).toContain(to);
  }
}

