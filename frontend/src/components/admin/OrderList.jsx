import { useEffect, useState } from "react";
import axios from "axios";

function OrderList() {
  const baseUrl = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([]);

useEffect(() => {
  fetchOrders();

  const interval = setInterval(fetchOrders, 3000);
  return () => clearInterval(interval);
}, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${baseUrl}/orders`);
    setOrders(res.data);
  };

  return (
    <div className="container mt-5">
      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card p-3 mb-3">
          <p><strong>Total:</strong> ${order.totalPrice}</p>
          <p><strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderList;