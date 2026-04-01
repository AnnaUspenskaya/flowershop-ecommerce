import { useState } from "react";
import { checkoutCart } from "../services/PaymentService.js";
import { useNavigate } from 'react-router-dom';


function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    note: ""
  });

  const [message, setMessage] = useState("");

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  //  CHANGE QUANTITY
  const updateQuantity = (item, qty) => {
    if (qty < 1) return;

    if (qty > item.stock) {
      setMessage(" Not enough stock");
      return;
    }

    const updated = cart.map((p) =>
      p._id === item._id ? { ...p, quantity: qty } : p
    );

    setCart(updated);
    setMessage("");
  };

  //  REMOVE ITEM
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
  };

  // HANDLE FORM
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CHECKOUT
  const handleCheckout = async () => {
    if (!form.address || !form.city || !form.postalCode || !form.country) {
      setMessage("⚠️ Please fill all required fields");
      return;
    }

    try {
      const res = await checkoutCart(cart);

      localStorage.setItem("orderNote", form.note);

      window.location.href = res.url;

    } catch (err) {
      console.error(err);
      setMessage("❌ Payment error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">

        {/* LEFT SIDE | CART ITEMS */}
        <div className="col-md-7">
          <h3>Your Cart</h3>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="card mb-3 p-3">

                <h5>{item.name}</h5>
                             < div className="col-md-3">
                <img
                  src={item.image || "https://via.placeholder.com/200"}
                  className="card-img-top"
                  alt={item.name} 
                  onClick={() => navigate(`/product/${item._id}`)} 
                  style={{ cursor: 'pointer' }}
                />
                </div>
                <p>${item.price}</p>

                {/* QUANTITY CONTROL */}
                <div className="d-flex align-items-center gap-2">

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>

                </div>

                {/* STOCK WARNING */}
                {item.stock <= 3 && (
                  <small className="text-danger">
                    Low stock: only {item.stock} left
                  </small>
                )}

                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>

              </div>
            ))
          )}
        </div>

        {/*  RIGHT SIDE | CHECKOUT FORM */}
        <div className="col-md-5">
          <h3>Checkout</h3>

          <div className="card p-3">

            <input
              className="form-control mb-2"
              name="address"
              placeholder="Address *"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              name="city"
              placeholder="City *"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              name="postalCode"
              placeholder="Postal Code *"
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              name="country"
              placeholder="Country *"
              onChange={handleChange}
            />

            {/* NOTE (OPTIONAL)*/}
            <textarea
              className="form-control mb-2"
              name="note"
              placeholder="Gift note (optional)"
              onChange={handleChange}
            />

            <h5>Total: ${total.toFixed(2)}</h5>

            {message && (
              <div className="alert alert-warning">{message}</div>
            )}

            <button
              className="btn btn-success w-100 mt-2"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Pay with Stripe
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;