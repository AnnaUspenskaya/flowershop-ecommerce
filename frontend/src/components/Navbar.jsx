import React from 'react';
import {Link, useNavigate} from "react-router-dom";

export const Navbar = ({cart}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); 
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();

  }
  return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4">
          <Link className='navbar-brand fw-bold' to="/">
          🌸 FlowerShop 🌸
          </Link>

          <div className='ms-auto d-flex align-items-center gap-3'>

            {user?.role === "admin" && (
          <Link to="/admin" className='btn btn-outline-light'>
            Admin
          </Link>
        )}

{user ? (
          <div className="user-menu-container position-relative">
            <span className="text-white fw-bold" style={{ cursor: 'pointer' }}>
              Hi, {user.username} ▾
            </span>
            
            <div className="logout-dropdown">
              <button 
                onClick={handleLogout} 
                className="btn btn-danger btn-sm w-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className='btn btn-outline-light'>
            Login / Sign Up
          </Link>
        )}

          <Link to="/cart" className='position-relative text-white'>
            🛒 {cart?.length > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {cart.length}
            </span>
            )}

          </Link>
          </div>
        </nav>

  )
}

export default Navbar;