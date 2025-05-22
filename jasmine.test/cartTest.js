import { addToCart, getCart, setCart, loadFromStorage } from "../data/cart.js";

describe('test suite: addToCart', () => {
  beforeEach(() => {
    // Reset the cart manually before each test
    setCart([]);
  });

  it('adds a product to an empty cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    const cart = getCart();
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toBe('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toBe(1);
    expect(cart[0].deliveryOptionsId).toBe('1');
  });

  it('increments quantity if product already exists in cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    const cart = getCart();
    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toBe(2);
  });
});
