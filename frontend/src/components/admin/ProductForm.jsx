import { useEffect, useState } from "react";
import axios from "axios";

function ProductForm() {
  const baseUrl = import.meta.env.VITE_API_URL
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] =useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  
  // NEW STATE FOR UPLOADING STATUS
  const [uploading, setUploading] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${baseUrl}/items`);
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    setError("Cloud Name is missing. Check your .env file and restart your server.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    setUploading(true);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    setProduct({ ...product, image: res.data.secure_url });
    setUploading(false);
  } catch (err) {
    console.error("Error uploading image", err.response?.data || err);
    setError(err.response?.data?.error?.message || "Failed to upload image");
    setUploading(false);
  }
};

  const checkItemName = async () => {
    if (!product.name) return;

    try {
      const res = await axios.get(
        `${baseUrl}/items/check/${product.name}`
      );

      if (res.data.exists) {
        setNameMessage(
          "⚠️ Item already exists. It will be updated."
        );
      } else {
        setNameMessage("");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
        let res;
        if(editItemId){
       res = await axios.put(
        `${baseUrl}/items/${editItemId}`,
        product
        );
        }else{
            res =await axios.post(`${baseUrl}/items`,
                product
            );
        }

      setMessage(res.data.message);

      // RESET FORM
      setProduct({
        name: "",
        price: "",
        category: "",
        image: "",
        description: "",
        stock: ""
      });
      setEditItemId(null);
      // REFRESH LIST
      fetchProducts();

    } catch (err) {
      setError(err.response?.data?.error || "Error saving product");
    }
  };

  // GROUP BY CATEGORY
  const groupedProducts = products.reduce((acc, item) => {
    const cat = item.category || "Other";

    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);

    return acc;
  }, {});


  const handleEdit = (item) => {
    setProduct({
    name: item.name,
    price: item.price,
    category: item.category,
    image: item.image,
    description: item.description,
    stock: item.stock
    });

    setEditItemId(item._id);
  };

const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowModal(true);
}

const confirmDelete = async () => {
    try{
        await axios.delete(`${baseUrl}/items/${itemToDelete._id}`);
        setShowModal(false);
        fetchProducts();
    }catch(err){
        console.error(err);
    }
};
const toggleFeatured = async(id) => {
    try{
        await axios.put(`${baseUrl}/items/featured/${id}`);
        fetchProducts();
    }catch (err) {
        console.log(err);
    }
}
  return (
    <div className="container">

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-5">
        <h3>{editItemId ? "Edit Product" : "Add Product"}</h3>

        <input
          className="form-control mb-1"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          onBlur={checkItemName}
        />

        {nameMessage && (
          <div className="text-warning mb-2">{nameMessage}</div>
        )}

        <input
          className="form-control mb-2"
          name="price"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
        />

        <select
          className="form-select mb-2"
          name="category"
          value={product.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Flowers">Flowers</option>
          <option value="Sweets">Sweets</option>
          <option value="Gifts">Gifts</option>
          <option value="Balloons">Balloons</option>
        </select>

        {/* IMAGE UPLOAD FIELD */}
        <div className="mb-2">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control mb-1"
            onChange={handleImageUpload}
            accept="image/*"
          />
          {uploading && <small className="text-info">Uploading image...</small>}
          {product.image && !uploading && (
            <div className="mt-2">
              <img src={product.image} alt="Preview" style={{ width: "100px", borderRadius: "5px" }} />
            </div>
          )}

          <input
            type="hidden"
            name="image"
            value={product.image}
          />
        </div>

        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="stock"
          type="number"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
        />

        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <button className="btn btn-primary" disabled={uploading}>
          {uploading ? "Waiting for upload..." : editItemId ? "Update Item" : "Save"}
        </button>
      </form>

      {/* PRODUCT LIST */}
      <h3>All Products</h3>

      {Object.keys(groupedProducts).map((category) => (
        <div key={category} className="mb-5">

          <h4 className="text-uppercase text-primary">{category}</h4>
          <hr />

          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Description</th>
                 <th>Featured</th>
                <th>Actions</th>
                <th></th>

              </tr>
            </thead>

            <tbody>
              {groupedProducts[category].map((item) => (
                <tr key={item._id}>

                  <td>
  {item.image ? (
    <img src={item.image} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
  ) : (
    <div style={{ width: "40px", height: "40px", background: "#eee", display: "inline-block" }}></div>
  )}
</td>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>${item.price}</td>
                  <td>{item.description}</td>
                            <td>
            <input className="form-check-input" type="checkbox"
            checked={item.isFeatured || false}
            onChange={() => toggleFeatured(item._id)} />
          </td>
                                      <td>       
            <button
          className="btn btn-warning btn-sm"
          onClick={() => handleEdit(item)}
        >
          Edit
        </button></td>
                  <td>       
                    <button
          className="btn btn-danger btn-sm"
          onClick={() => openDeleteModal(item)}
        >
          Delete
        </button></td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

      {/* DELETE MODAL */}
      {showModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">Delete</h5>
          <button
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete <strong>{itemToDelete?.name}</strong>  ?</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-danger"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ProductForm;