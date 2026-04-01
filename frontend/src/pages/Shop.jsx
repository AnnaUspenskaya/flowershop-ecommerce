import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


function Shop({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState(selectedCategory || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${baseUrl}/items`);
    setProducts(res.data);
  };

  let displayProducts = [...products];

  ///SEARCH
  if (search) {
    displayProducts = displayProducts.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  //CATEGORY FILTER
  const activeCategory = category || selectedCategory;
  if (activeCategory) {
    displayProducts = displayProducts.filter(
      (item) => item.category === activeCategory
    );
  }

  //SORT BY PRICE 
  // low to high
  if (sort === "low") {
    displayProducts.sort((a, b) => a.price - b.price);
  }

  //high to low
  if (sort === "high") {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  // ADD TO CART
  const addToCart = (item) => {
    const existingItem = cart.find((p) => p._id === item._id);

    if (existingItem) {
      const updated = cart.map((p) =>
        p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setMessage(`${item.name} added to cart`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="container mt-5">

      <div className="row mb-4">
        {/* SEARCH   */}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* SORT BY CATEGORY   */}
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Flowers">Flowers</option>
            <option value="Sweets">Sweets</option>
            <option value="Gifts">Gifts</option>
            <option value="Balloons">Balloons</option>
          </select>
        </div>

        {/* SORT BY PRICE*/}
        <div className="col-md-4">
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      <h2>Shop {activeCategory && `- ${activeCategory}`}</h2>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => {
          setCategory("");
          setSearch("");
          navigate("/shop");
        }}
      >
        Show All
      </button>

      {message && <div className="alert alert-success text-center">{message}</div>}

      <div className="row">
        {displayProducts.map((item) => (
          <div className="col-md-3" key={item._id}>
            <div className="card mb-3">
              <img
                src={item.image || "https://via.placeholder.com/200"}
                className="card-img-top"   
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: "pointer" }}
                alt={item.name}
              />

<h5 onClick={() => navigate(`/product/${item._id}`)}>
  {item.name}
</h5>



              <div className="card-body text-center">
                
                <p>${item.price}</p>
                <button
                  className="btn btn-success"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Shop;