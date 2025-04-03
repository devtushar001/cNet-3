import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import { assets } from "../../assets/escomData";
import { EscomContext } from "../../Context/escomContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { backend_url, user, token, readDate } = useContext(EscomContext);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login-signup");
  }, [user, navigate]);

  const logOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const [userRes, orderRes] = await Promise.all([
        fetch(`${backend_url}/api/user/get-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${backend_url}/api/razorpay/get-order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        toast.success(userData.message);
      }

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrderData(orderData.data);
        toast.success(orderData.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      toast.error("Failed to fetch user or order data");
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [backend_url, token]);

  return (
    <div className="user-prfl">
      <div className="user-info">
        <div className="user-details">
          <img src={assets.user_icon} alt="User Icon" className="user-icon" />
          <h2>{user ? `${user.name}` : "Loading..."}</h2>
        </div>
        <div className="user-actions">
          <Link to="/cart" className="cart-btn">
            Go to Cart
          </Link>
          <button onClick={logOut} className="logout-btn">
            Log Out
          </button>
        </div>
      </div>
      <hr />
      {orderData.length > 0 ? (
        orderData.map((order, index) => (
          <div key={index} className="order-card">
            <h3>Order Details</h3>
            <div className="order-details">
              <p className="status">
                <span className={order.payment ? "success" : "failled"}>
                  {order.payment ? "Success" : "Failled"}
                </span>
              </p>
              <p>Order ID: {order._id}</p>
              <p>Paid Amount: ₹{order.amount}</p>
              <p>Placed on: {readDate(order.createdAt)}</p>
            </div>
            <div className="address-card">
              <h3>Order Address</h3>
              <div className="address-content">
                <p>Placed by: {order.address.firstName} {order.address.lastName}</p>
                <p>Contact: {order.address.email}</p>
                <p>State: {order.address.state}</p>
                <p>Street: {order.address.street}</p>
                <p>Zipcode: {order.address.zipcode}</p>
                <p>Address: {order.address.fulladdress}</p>
              </div>
            </div>
            <div className="cart-section">
              <h3>Items Purchased</h3>
              <div className="cart-grid">
                {order.cartData.map((item, i) => (
                  <Link key={i} className="no-style" to={`/shops/${item._id}`}>
                    <div className="cart-item">
                      <img src={item.featuredImg} alt={item.title} className="cart-img" />
                      <div>
                        <h3>{item.title}</h3>
                        <p>Category: {item.shopCategory}</p>
                        <p>Price: {item.price}</p>
                        <p>Quantity: {item.quantity || 1}</p>
                        <p>Total Price : {Number(item.price) * Number(item.quantity)}</p>
                      </div>
                    </div>
                  </Link>
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
