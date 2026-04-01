import { useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";


function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSignup
        ? "http://localhost:3500/signup"
        : "http://localhost:3500/login";

      const res = await axios.post(url, form);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(res.data));

      setMessage("✅ Success!");

    navigate("/");
    window.location.reload();

    } catch (err) {
      setMessage(
        err.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">
        {isSignup ? "Sign Up" : "Login"}
      </h2>

      <form onSubmit={handleSubmit}>

        {isSignup && (
          <input
            className="form-control mb-2"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}

        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        <button className="btn btn-primary w-100">
          {isSignup ? "Sign Up" : "Login"}
        </button>

      </form>

      {/* TOGGLE */}
      <p className="text-center mt-3">
        {isSignup ? "Already have an account?" : "No account?"}

        <span
          style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}

export default Login;