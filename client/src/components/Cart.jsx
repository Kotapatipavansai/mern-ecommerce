import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const getTotal = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce((total, item) => {
      const price = Number(item.productId?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h3 className="text-center mt-5">Cart is empty</h3>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>

      {cart.items.map((item) => (
        <div className="card mb-3 p-3" key={item._id}>
          <div className="row align-items-center">

            {/* ✅ IMAGE FIX */}
            <div className="col-md-3">
              <img
                src={item.productId?.image || "https://via.placeholder.com/100"}
                alt={item.productId?.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>

            <div className="col-md-6">
              <h5>{item.productId?.name}</h5>
              <p>₹{item.productId?.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>

            <div className="col-md-3">
              <h6>
                ₹{(item.productId?.price || 0) * item.quantity}
              </h6>
            </div>

          </div>
        </div>
      ))}

      <h4 className="mt-4 text-end">Total: ₹{getTotal()}</h4>
    </div>
  );
}