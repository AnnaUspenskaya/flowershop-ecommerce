
import { useState } from "react";
import ProductForm from "../components/admin/ProductForm";
import ProductList from "../components/admin/ProductList";
import OrderList from "../components/admin/OrderList";

const Admin = () => {
  const [view, setView] = useState("products");

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3">
          <h4>Admin</h4>

          <button className="btn btn-light w-100 mb-2"
            onClick={() => setView("products")}>
            Products
          </button>

          <button className="btn btn-light w-100 mb-2"
            onClick={() => setView("add")}>
            Add Product
          </button>

          <button className="btn btn-light w-100"
            onClick={() => setView("orders")}>
            Orders
          </button>
        </div>

        {/* Content */}
        <div className="col-md-10 p-4">
          {view === "products" && <ProductList />}
          {view === "add" && <ProductForm />}
          {view === "orders" && <OrderList />}
        </div>

      </div>
    </div>
  );
}

export default Admin;