import React from 'react'
import {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Home ({cart, setCart}) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3500/items");
    setProducts(res.data);
  };
const featuredProducts = products.filter(
  (item) => item.isFeatured === true
);

const addToCart = (item) => {
  const existingItem = cart.find((p) => p._id === item._id);

  if (existingItem) {
    const updatedCart = cart.map((p) =>
      p._id === item._id
        ? { ...p, quantity: p.quantity + 1 }
        : p
    );
    setCart(updatedCart);
  } else {
    setCart([...cart, { ...item, quantity: 1 }]);
  }

  setCartMessage(`${item.name} added to your cart`);

  setTimeout(() => {
    setCartMessage("");
  }, 2000);
};

  return (
    <div>
  
    {/* HERO */}
    <div className='bg-light text-center p5'>
      <h1 className="display-4">Show your Love</h1>
      <p>Flowers, sweets and much more delivered to your loved one door</p>
      <button className="btn btn-primary" onClick={()  => navigate("/shop")}>Shop Now</button>
    </div>
    {/* CATEGORIES */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Shop by Category</h2>

        <div className="row">

      <div
        className="col-md-3"
        onClick={() => navigate("/shop?category=Flowers")}
        style={{ cursor: "pointer" }}
      >
        <div className="card p-3 text-center">
        <h5>Flowers</h5>
        </div>
      </div>

          <div className="col-md-3"
          onClick={() => navigate("/shop?category=Gifts")}
          style={{cursor: "pointer"}}>
            <div className="card p-3 text-center">
              <h5>Gifts</h5>
            </div>
          </div>

          <div className="col-md-3"
          onClick={() => navigate("/shop?category=Sweets")}
          style={{cursor: "pointer"}}>
            <div className="card p-3 text-center">
              <h5>Sweets</h5>
            </div>
          </div>

                   <div className="col-md-3"
          onClick={() => navigate("/shop?category=Balloons")}
          style={{cursor: "pointer"}}>
            <div className="card p-3 text-center">
              <h5>Balloons</h5>
            </div>
          </div>

        </div>
      </div>
      {/* FEATURED PRODUCTS */}
            <div className="container mt-5">
        <h2 className="text-center mb-4">Featured Products</h2>
                  {cartMessage && (
  <div className="alert alert-success text-centere">
    {cartMessage}
  </div>
)}
        <div className="row">

          {featuredProducts.map((item) => (
            <div className="col-md-3" key={item._id}>
              <div className="card">
                <img
                  src={item.image || "https://via.placeholder.com/200"}
                  className="card-img-top"
                  alt={item.name} 
                  onClick={() => navigate(`/product/${item._id}`)} 
                  style={{ cursor: 'pointer' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.name}</h5>
                  <p>${item.price}</p>

                  <button className="btn btn-success"
                  onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>

    
  )
}

export default Home