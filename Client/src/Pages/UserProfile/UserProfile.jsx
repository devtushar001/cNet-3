import React, { useContext, useEffect, useState } from "react";
import './UserProfile.css';
import { assets } from "../../assets/escomData";
import { EscomContext } from "../../Context/escomContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { backend_url, user, token } = useContext(EscomContext);
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
      console.log(data)
      setOrderData(data.data);
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
      <div className="history">
        {orderData.length > 0 ? (
          orderData.map((order, index) => <div key={index}>
            <p>{order.status}</p>
            <p>{order.payment ? "Success" : "Failled"}</p>
            <p>{order.amount}</p>
          </div>)
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
