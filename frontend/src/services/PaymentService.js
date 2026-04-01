import axios from "axios";

const baseUrl = "http://localhost:3500";

export async function checkoutCart(cartItems) {
  const response = await axios.post(
    `${baseUrl}/checkout-session`,
    { cartItems }
  );
  return response.data;
}

export async function createOrder(sessionId) {

  const response = await axios.post(`${baseUrl}/order?sessionId=${sessionId}`);
  return response.data;
}