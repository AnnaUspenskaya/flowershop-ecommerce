import { useEffect, useState } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal]= useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${baseUrl}/items`);
    setProducts(res.data);
  };

  //  GROUP BY CATEGORY
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Other";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(product);
    return acc;
  }, {});

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
  return (
    <div>
      <h3>Products</h3>

      {/* LOOP THROUGH CATEGORIES */}
      {Object.keys(groupedProducts).map((category) => (
        <div key={category} className="mb-5">

          {/* CATEGORY TITLE */}
          <h4 className="text-uppercase">{category}</h4>
          <hr />

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {groupedProducts[category].map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.description}</td>
                  <td>

                    <button className="btn btn-danger"
                    onClick={() => openDeleteModal(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

      {/* DELETE ITEM MODEL */}

      { showModal && ( 
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete</h5>
                        <button className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
  <p>
    Are you sure you want to delete{" "}
    <strong>{itemToDelete?.name}</strong>?
  </p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={confirmDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

        </div>
      )
        
      }



    </div>
  );
}

export default ProductList;