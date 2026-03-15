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
    // Directly set the input values and trigger React events
    await this.page.evaluate(({fromDate, toDate}) => {
      const fromInput = document.querySelector('#fromDate') as HTMLInputElement;
      const toInput = document.querySelector('#toDate') as HTMLInputElement;

      if (fromInput && toInput) {
        // Set values
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(fromInput, fromDate);
          fromInput.dispatchEvent(new Event('input', { bubbles: true }));
          fromInput.dispatchEvent(new Event('change', { bubbles: true }));

          nativeInputValueSetter.call(toInput, toDate);
          toInput.dispatchEvent(new Event('input', { bubbles: true }));
          toInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }, { fromDate: from, toDate: to });

    // Wait for React to process the state change
    await this.page.waitForTimeout(1000);
  }

  async submitReport() {
    // Wait for button to be enabled (not loading)
    await expect(this.getReportButton).toBeEnabled();

    // Click the button
    await this.getReportButton.click();

    // Wait for network to be idle (API call complete)
    await this.page.waitForLoadState('networkidle');

    // Additional wait to ensure React re-renders with new data
    await this.page.waitForTimeout(500);
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

