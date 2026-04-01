import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createOrder } from "../services/PaymentService";

function Success({ setCart }) {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const hasCalled = useRef(false); 

  useEffect(() => {
    if (sessionId && !hasCalled.current) {
      hasCalled.current = true;
      finalizeOrder();
    }
  }, [sessionId]);

  const finalizeOrder = async () => {
    try {
      await createOrder(sessionId);
      

      setCart([]);

      localStorage.removeItem("cart");
      
      console.log("Order finalized and cart cleared");
    } catch (err) {
      console.error("Finalization failed:", err);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Payment Successful! 🌸</h2>
      <p>Your order is being processed.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Return Home</button>
    </div>
  );
};

export default Success;