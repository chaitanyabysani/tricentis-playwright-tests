import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // ── Billing Address ──────────────────────────────────────────────────────
  readonly billingAddressDropdown: Locator;
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingEmail: Locator;
  readonly billingCountry: Locator;
  readonly billingState: Locator;
  readonly billingCity: Locator;
  readonly billingAddress1: Locator;
  readonly billingZip: Locator;
  readonly billingPhone: Locator;
  readonly billingContinueButton: Locator;

  // ── Shipping Address ─────────────────────────────────────────────────────
  readonly shipToSameAddressCheckbox: Locator;
  readonly shippingContinueButton: Locator;

  // ── Shipping Method ──────────────────────────────────────────────────────
  readonly shippingMethodOptions: Locator;
  readonly shippingMethodContinueButton: Locator;

  // ── Payment Method ───────────────────────────────────────────────────────
  readonly paymentMethodOptions: Locator;
  readonly paymentMethodContinueButton: Locator;

  // ── Payment Info ─────────────────────────────────────────────────────────
  readonly paymentInfoContinueButton: Locator;

  // ── Confirm Order ────────────────────────────────────────────────────────
  readonly confirmOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Billing
    this.billingAddressDropdown = page.locator('#billing-address-select');
    this.billingFirstName = page.locator('#BillingNewAddress_FirstName');
    this.billingLastName = page.locator('#BillingNewAddress_LastName');
    this.billingEmail = page.locator('#BillingNewAddress_Email');
    this.billingCountry = page.locator('#BillingNewAddress_CountryId');
    this.billingState = page.locator('#BillingNewAddress_StateProvinceId');
    this.billingCity = page.locator('#BillingNewAddress_City');
    this.billingAddress1 = page.locator('#BillingNewAddress_Address1');
    this.billingZip = page.locator('#BillingNewAddress_ZipPostalCode');
    this.billingPhone = page.locator('#BillingNewAddress_PhoneNumber');
    this.billingContinueButton = page.locator('#billing-buttons-container .button-1');

    // Shipping address
    this.shipToSameAddressCheckbox = page.locator('#ShipToSameAddress');
    this.shippingContinueButton = page.locator('#shipping-buttons-container .button-1');

    // Shipping method
    this.shippingMethodOptions = page.locator('input[name="shippingoption"]');
    this.shippingMethodContinueButton = page.locator('#shipping-method-buttons-container .button-1');

    // Payment method
    this.paymentMethodOptions = page.locator('input[name="paymentmethod"]');
    this.paymentMethodContinueButton = page.locator('#payment-method-buttons-container .button-1');

    // Payment info
    this.paymentInfoContinueButton = page.locator('#payment-info-buttons-container .button-1');

    // Confirm
    this.confirmOrderButton = page.locator('#confirm-order-buttons-container .button-1');
  }

  async fillBillingAddress(details: {
    firstName: string;
    lastName: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zip: string;
    phone: string;
  }) {
    // If dropdown exists (existing addresses), select "New Address"
    if (await this.billingAddressDropdown.isVisible()) {
      await this.billingAddressDropdown.selectOption({ label: 'New Address' });
    }

    await this.billingFirstName.fill(details.firstName);
    await this.billingLastName.fill(details.lastName);
    await this.billingCountry.selectOption({ label: details.country });
    await this.page.waitForTimeout(500); // wait for state dropdown to load
    await this.billingState.selectOption({ label: details.state });
    await this.billingCity.fill(details.city);
    await this.billingAddress1.fill(details.address);
    await this.billingZip.fill(details.zip);
    await this.billingPhone.fill(details.phone);
  }

  async continueBilling() {
    await this.billingContinueButton.click();
    await this.page.waitForTimeout(1000);
  }

  async continueShipping() {
    await this.shippingContinueButton.click();
    await this.page.waitForTimeout(1000);
  }

  async selectShippingMethod(index: number = 0) {
    await this.shippingMethodOptions.nth(index).check();
  }

  async continueShippingMethod() {
    await this.shippingMethodContinueButton.click();
    await this.page.waitForTimeout(1000);
  }

  async selectPaymentMethod(methodName: string) {
    const label = this.page.locator(`label:has-text("${methodName}")`).first();
    const labelVisible = await label.isVisible().catch(() => false);
    if (labelVisible) {
      await label.click();
    } else {
      await this.paymentMethodOptions.first().check();
    }
  }

  async continuePaymentMethod() {
    await this.paymentMethodContinueButton.click();
    await this.page.waitForTimeout(1000);
  }

  async continuePaymentInfo() {
    if (await this.paymentInfoContinueButton.isVisible()) {
      await this.paymentInfoContinueButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async confirmOrder() {
    await this.confirmOrderButton.click();
  }
}
