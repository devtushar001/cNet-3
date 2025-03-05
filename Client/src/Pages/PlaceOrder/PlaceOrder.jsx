import React, { useContext, useState, useEffect } from "react";
import { EscomContext } from "../../Context/escomContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PlaceOrder.css";
import { Link } from "react-router-dom";

const PlaceOrder = () => {
    const { productData, backend_url, token, cartData, setCartData } = useContext(EscomContext);
    const navigate = useNavigate();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        fulladdress: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        phone: "+91-8795874537"
    })

    const totalPrice = 320;

    const razorPayScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error("Failed to load Razorpay script"));
            document.body.appendChild(script);
        });
    };

    const razorPayPlaceOrder = async () => {
        try {
            const response = await fetch(`${backend_url}/api/razorpay/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to create Razorpay order");
            }

            const result = await response.json();

            const paymentObject = new window.Razorpay({
                key: "rzp_test_7EMWMnwaBLDxbZ",
                amount: Number(result.amount),
                currency: "INR",
                order_id: result.razorpayOrder.id,
                handler: async function (response) {
                    const paymentDetails = {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    };

                    try {
                        const verifyResponse = await fetch(`${backend_url}/api/razorpay/verify-order`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(paymentDetails),
                        });

                        const verifyResult = await verifyResponse.json();
                        if (!verifyResponse.ok) {
                            throw new Error(verifyResult.message || "Payment verification failed");
                        }

                        toast.success("Payment Verified Successfully");

                    } catch (err) {
                        toast.error("Error verifying payment: " + err.message);
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "1234567890",
                },
                theme: {
                    color: "#00506e",
                },
            });

            paymentObject.open();

        } catch (error) {
            alert("Error processing the order: " + error.message);
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        console.log(token);
    }, [])

    useEffect(() => {
        razorPayScript("https://checkout.razorpay.com/v1/checkout.js")
            .then(() => setScriptLoaded(true))
            .catch((error) => alert(error.message));
    }, [data]);

    const getCart = async () => {
        try {
            const response = await fetch(`${backend_url}/api/user-cart/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data.cart)
            setCartData(data.cart);
        } catch (error) {
            console.error("Failed to fetch cart data:", error.message);
        }
    };

    useEffect(() => {
        getCart();
        console.log(cartData);
    }, [backend_url]);

    return (
        <>
            <div className="place-order">
                <div className="left-container">
                    <div className="user-data">
                        <div className="input">
                            <input onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))} type="text" placeholder="First name" name="fname" id="fname" />
                            <input onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))} type="text" placeholder="Last name" name="lname" id="lname" />
                        </div>
                        <input onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))} type="email" placeholder="Email" name="email" id="email" />
                        <textarea onChange={(e) => setData((prev) => ({ ...prev, fulladdress: e.target.value }))} style={{ padding: "5px", minHeight: "120px", outlineColor: 'darkgreen' }} name="fulladdress" id="fulladdress" placeholder="Home address" ></textarea>
                        <div className="input">
                            <input onChange={(e) => setData((prev) => ({ ...prev, street: e.target.value }))} type="text" name="street" id="street" placeholder="Street" />
                            <input onChange={(e) => setData((prev) => ({ ...prev, city: e.target.value }))} type="text" name="city" id="city" placeholder="City" />
                        </div>

                        <input onChange={(e) => setData((prev) => ({ ...prev, state: e.target.value }))} type="number" name="state" id="state" placeholder="State" />
                        <input onChange={(e) => setData((prev) => ({ ...prev, zipcode: e.target.value }))} type="number" name="zipcode" id="zipcode" placeholder="Zipcode" />
                        <div className="item-info">
                            <div className="cart-amount">
                                <p>Total Cart Amount</p><p>&#8377; {totalPrice.toFixed(2)}</p>
                            </div>
                            <hr />
                            <div className="cart-amount">
                                <p>Shipping Charge</p>
                                <p>&#8377; {0}</p>
                            </div>
                            <hr />
                            <div style={{ fontWeight: 'bold' }} className="cart-amount">
                                <p>Total Amount</p>
                                <p>&#8377; {(totalPrice).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="total-payment">
                            <button style={{ padding: '10px 20px', width: '100%', cursor: 'pointer', color: '#fff', background: '#f76300', border: 'none' }} className="place-order-btn" onClick={razorPayPlaceOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
                <div className="right-container">
                    <h2>Order Summary</h2>
                    <hr />
                    <div className="cart-items">
                        {cartData.length > 0 ? (
                            cartData.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <Link to={`/shops/${item._id}`}><img src={item.featuredImg} alt={item.title} className="cart-item-image" /></Link>
                                    <div className="cart-item-details">
                                        <h3>{item.title}</h3>
                                        <p>Price: &#8377; {Number(item.price).toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items in cart</p>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default PlaceOrder;
