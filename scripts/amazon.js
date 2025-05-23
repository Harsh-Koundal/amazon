// products.js

import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";

// Render the product grid
let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector" data-product-id="${product.id}">
          ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}" style="display: none;">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

// Add the HTML to the page
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Update cart quantity displayed
function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.cartQuantity').innerHTML = cartQuantity;
}

// Add to cart button logic
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    // Get selected quantity
    const quantitySelector = document.querySelector(`.js-quantity-selector[data-product-id="${productId}"]`);
    const selectedQuantity = Number(quantitySelector.value);

    // Add product to cart
    addToCart(productId, selectedQuantity);
    updateCartQuantity();

    // Show confirmation message
    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessage.style.display = 'block';

    setTimeout(() => {
      addedMessage.style.display = 'none';
    }, 1500);
  });
});

// Initial quantity update
updateCartQuantity();
