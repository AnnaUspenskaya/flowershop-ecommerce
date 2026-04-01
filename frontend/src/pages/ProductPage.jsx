import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const res = await axios.get(`http://localhost:3500/items`);
    setAllProducts(res.data);
    const found = res.data.find((p) => p._id === id);
    setProduct(found);
  };

  const relatedItems = allProducts.filter((item) => item.category !== product?.category)
                            .reduce((acc, item) => {
                                if (!acc[item.category]) {
                                acc[item.category] = item; 
                                }
                                return acc;
                            }, {});

const relatedList = Object.values(relatedItems);

const addToCart = (item = product) => {

    if(qty <=0){
      setMessage("Please select at least 1 item");
      return;
    }
    const existing = cart.find((p) => p._id === item._id);

    const currentQty = existing? existing.quantity : 0;

    if(currentQty + qty > item.stock){
        setMessage("Not enough stock available");
        return; 
    }

    if (existing) {
      const updated = cart.map((p) =>
        p._id === item._id
          ? { ...p, quantity: p.quantity + qty }
          : p
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
    setMessage(`${item.name} added to cart`);

    setTimeout(()=>setMessage(""), 2000)
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
 
      <h2>{product.name}</h2>

      <img
        src={product.image}
        style={{ width: "300px" }}
      />

      <p>{product.description}</p>
      <h4>${product.price}</h4>

      {/* QUANTITY */}

    {product.stock === 0 && (
        <p className="text-danger">Out of stock</p>
    )}
    {product.stock >0 && product.stock <= 3 && (
        <p className="text-warning">
            Only {product.stock} left in stock
        </p>
    )}
    <p>Quantity: </p>  
    <input
    value={qty === 0 ? "" : qty}
        type="number"
        min="1"
        max={product.stock}
        className="form-control w-25 mb-2"
onChange={(e) => {
        const val = e.target.value;

        if (val === "") {
            setQty(0);
        } else {

            const num = parseInt(val, 10);
            if (num <= product.stock) {
                setQty(num);
            } else {
                setQty(product.stock); 
            }
        }
    }}
/>

      {message && (
  <div className="alert alert-success">
    {message}
  </div>
)}

      <button className="btn btn-success" onClick={() => addToCart(product)}
        disabled = {product.stock===0}>
        Add to Cart
      </button>
      <h4 className="mt-5">Goes well with:</h4>
      <div className="row">
        {relatedList.map((item) => (
            <div className="col-md-3" key={item._id}>
                <div className="card text-center p-2">
                    <img src={item.image || "https://www.muhealth.org/sites/default/files/styles/max_1300x1300/public/2022-07/hands-heart-GettyImages-1214096914-760%20v2.jpg?itok=1gS0H2HW"}
                    style={{ height: "120px", objectFit: "cover" }} />

                    <h6>{item.name}</h6>
                    <p>${item.price}</p>


                            <button
          className="btn btn-sm btn-success"
          onClick={() => addToCart(item)}
        >
          Add
        </button>
                </div>
            </div>
        ))}

      </div>

    </div>
  );
}

export default ProductDetails;