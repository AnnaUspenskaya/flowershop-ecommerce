import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage"
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

function App() {
  const [cart, setCart] = useState(() => {
    // LOAD CART FROM localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart && savedCart !== "undefined") {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <Navbar cart={cart} />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1">

        <Routes>
          <Route
            path="/"
            element={<Home cart={cart} setCart={setCart} />}
          />

          <Route
            path="/shop"
            element={<Shop cart={cart} setCart={setCart} />}
          />

          <Route
            path="/product/:id"
            element={<ProductPage cart={cart} setCart={setCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} />}
          />

          <Route path="/admin" element={<Admin />} />

          <Route path="/login" element={<Login />} />
          <Route
          path="/success"
          element={<Success setCart={setCart} />}
        />
          <Route path="/cancel" element={<Cancel/>} />

        </Routes>

      </div>

      {/*FOOTER */}
      <Footer />

    </div>
  );
}

export default App;