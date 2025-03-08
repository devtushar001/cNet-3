import React, { useContext, useEffect, useState } from "react";
import './UserProfile.css';
import { assets } from "../../assets/escomData";
import { EscomContext } from "../../Context/escomContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { backend_url, user, token, readDate } = useContext(EscomContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login-signup');
    }
  }, [user, navigate]);

  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/'); // React Router navigation instead of window.location.href
  };

  const fetchUser = async () => {
    if (!token) return; // Prevent API call if token is missing

    try {
      const response = await fetch(`${backend_url}/api/user/get-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUser();
    window.scrollTo(0, 0);
  }, [backend_url, token]);

  const fetchOrder = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${backend_url}/api/razorpay/get-order`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.data)
      setOrderData(data.data);
      toast.success(data.message)
    } catch (error) {
      console.error("Error fetching order data:", error.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [backend_url, token]);

  return (
    <div className="user-prfl">
      <h1>{user ? "Howdy! " + user.name : "Loading..."}</h1>
      <div className="user-info">
        <img src={assets.user_icon} alt="User Icon" />
        <button onClick={logOut}>Log Out</button>
      </div>
      <hr />
      {orderData.length > 0 ? (
        orderData.map((order, index) => (
          <div key={index} className="order-card">
            {/* Order Details */}
            <div className="order-details">
              <p className="status">
                Order Status:
                <span className={order.status === "Pending" ? "pending" : "completed"}>
                  {order.status}
                </span>
              </p>
              <p>Order ID: {order._id}</p>
              <p>Total Amount: ₹{order.amount}</p>
              <p>Placed on: {readDate(order.createdAt)}</p>
            </div>

            {/* Cart Items */}
            <div className="cart-section">
              <h2>Items Purchased</h2>
              <div className="cart-grid">
                {order.cartData.map((item, i) => (
                  <div key={i} className="cart-item">
                    <img src={item.featuredImg} alt={item.title} className="cart-img" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>Category: {item.shopCategory}</p>
                      <p>Quantity: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
    </div>
  );
};

export default UserProfile;
