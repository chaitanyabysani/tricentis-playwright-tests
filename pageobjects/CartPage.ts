import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // Cart table
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;

  // Per cart item elements (use .nth(index) to target specific rows)
  readonly itemProductNames: Locator;
  readonly itemUnitPrices: Locator;
  readonly itemQuantityInputs: Locator;
  readonly itemSubtotals: Locator;
  readonly itemRemoveCheckboxes: Locator;

  // Cart actions
  readonly updateCartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  // Coupon code
  readonly couponCodeInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponMessage: Locator;

  // Gift card
  readonly giftCardInput: Locator;
  readonly applyGiftCardButton: Locator;

  // Order totals
  readonly subTotal: Locator;
  readonly shipping: Locator;
  readonly tax: Locator;
  readonly orderTotal: Locator;

  // Terms of service
  readonly termsOfServiceCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart table
    this.cartTable = page.locator('.cart');
    this.cartItems = page.locator('.cart tbody tr');
    this.emptyCartMessage = page.locator('.no-data');

    // Per cart item elements
    this.itemProductNames = page.locator('.cart .product-name a');
    this.itemUnitPrices = page.locator('.cart .unit-price .product-unit-price');
    this.itemQuantityInputs = page.locator('.cart .qty-input');
    this.itemSubtotals = page.locator('.cart .subtotal .product-subtotal');
    this.itemRemoveCheckboxes = page.locator('.cart .remove-from-cart input[type="checkbox"]');

    // Cart actions
    this.updateCartButton = page.locator('#updatecart');
    this.continueShoppingButton = page.locator('.continue-shopping-button');
    this.checkoutButton = page.locator('#checkout');

    // Coupon code
    this.couponCodeInput = page.locator('#couponcode');
    this.applyCouponButton = page.locator('#applycouponbutton');
    this.couponMessage = page.locator('.coupon-code-result');

    // Gift card
    this.giftCardInput = page.locator('#giftcardcouponcode');
    this.applyGiftCardButton = page.locator('#applygiftcardcouponcode');

    // Order totals
    this.subTotal = page.locator('.order-subtotal td:last-child');
    this.shipping = page.locator('.shipping-cost td:last-child');
    this.tax = page.locator('.tax-value td:last-child');
    this.orderTotal = page.locator('.order-total td:last-child');

    // Terms of service
    this.termsOfServiceCheckbox = page.locator('#termsofservice');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.itemProductNames.allTextContents();
  }

  async getOrderTotal(): Promise<string> {
    return await this.orderTotal.innerText();
  }

  async updateItemQuantity(index: number, quantity: number) {
    await this.itemQuantityInputs.nth(index).fill(String(quantity));
    await this.updateCartButton.click();
  }

  async removeItem(index: number) {
    await this.itemRemoveCheckboxes.nth(index).check();
    await this.updateCartButton.click();
  }

  async applyCoupon(code: string) {
    await this.couponCodeInput.fill(code);
    await this.applyCouponButton.click();
  }

  async applyGiftCard(code: string) {
    await this.giftCardInput.fill(code);
    await this.applyGiftCardButton.click();
  }

  async proceedToCheckout() {
    await this.termsOfServiceCheckbox.check();
    await this.checkoutButton.click();
  }
}
