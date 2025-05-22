let cart;



function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function loadFromStorage(){
  try {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (error) {
  cart = [];
}
}

export function getCart() {
  return cart;
}

export function addToCart(productId) {
  let matchingItem = cart.find(item => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionsId: '1' // Default to basic delivery
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, newDeliveryOptionId) {
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.deliveryOptionsId = newDeliveryOptionId;
    saveToStorage();
  }
}

export function setCart(newCart) {
  cart = newCart;
  saveToStorage();
}

export { cart };
