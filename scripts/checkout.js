import {
  getCart,
  removeFromCart,
  updateDeliveryOption
} from "../data/cart.js";

import { products, getProduct } from "../data/products.js";
import { formatCurrency } from "../utilities/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption
} from "../data/deliveryOptions.js";

function renderOrderSummary() {
  const cart = getCart();
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(product => product.id === cartItem.productId);
    const deliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionsId);

    // Skip invalid cart items
    if (!matchingProduct || !deliveryOption) {
      console.warn("Invalid cart item found:", cartItem);
      return;
    }

    const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  attachDeleteHandlers();
  attachDeliveryOptionHandlers();
  renderPriceSummary();
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((option) => {
    const deliveryDate = dayjs().add(option.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)}`;
    const isChecked = option.id === cartItem.deliveryOptionsId;

    html += `
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          value="${option.id}"
          data-product-id="${matchingProduct.id}"
          ${isChecked ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
  });

  return html;
}

function attachDeleteHandlers() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
    });
  });
}

function attachDeliveryOptionHandlers() {
  document.querySelectorAll('.delivery-option-input').forEach((input) => {
    input.addEventListener('change', () => {
      const productId = input.dataset.productId;
      const newDeliveryOptionId = input.value;

      updateDeliveryOption(productId, newDeliveryOptionId);
      renderOrderSummary();
    });
  });
}

function renderPriceSummary() {
  const cart = getCart();
  let totalProductPriceCents = 0;
  let totalShippingCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);

    if (!product || !deliveryOption) {
      console.warn("Missing product or deliveryOption in cart summary:", cartItem);
      return;
    }

    totalProductPriceCents += product.priceCents * cartItem.quantity;
    totalShippingCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = totalProductPriceCents + totalShippingCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentsummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.length}):</div>
      <div class="payment-summary-money">$${formatCurrency(totalProductPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(totalShippingCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentsummaryHTML;
}

// Initial render
renderOrderSummary();
