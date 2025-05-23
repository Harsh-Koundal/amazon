let cart = [];

// Load cart from localStorage
export function loadFromStorage() {
  try {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    cart = storedCart || [];
  } catch (error) {
    cart = [];
  }
}

// Save cart to localStorage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Get current cart
export function getCart() {
  return cart;
}

// Add item to cart
export function addToCart(productId, quantity = 1) {
  const matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionsId: '1' // Default delivery option
    });
  }

  saveToStorage();
}

// Remove item from cart
export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

// Update delivery option for item
export function updateDeliveryOption(productId, newDeliveryOptionId) {
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.deliveryOptionsId = newDeliveryOptionId;
    saveToStorage();
  }
}

// Replace entire cart (used for testing or admin purposes)
export function setCart(newCart) {
  cart = newCart;
  saveToStorage();
}

// Export the cart array itself
export { cart };

// 👇 IMPORTANT: Load cart when this module is imported
loadFromStorage();
