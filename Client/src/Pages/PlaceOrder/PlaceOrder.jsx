import React, { useContext, useState, useEffect } from "react";
import { EscomContext } from "../../Context/escomContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PlaceOrder.css";
import { Link } from "react-router-dom";

const PlaceOrder = () => {
    const { cartData, productData } = useContext(EscomContext);
    const navigate = useNavigate();
    const { backend_url, token } = useContext(EscomContext);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        fulladdress: "",
        street: "",
        city: "",
        zipcode: "",
    })


    const getCartItems = () => {
        return cartData.map(cartItem => {
            const product = productData.find(product => product._id === cartItem.productId);
            return product ? { ...product, quantity: cartItem.quantity } : null;
        }).filter(item => item !== null);
    };

    const cartItems = getCartItems();
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);


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
                    Autherization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result);

            const paymentObject = new window.Razorpay({
                key: "rzp_test_7EMWMnwaBLDxbZ",
                amount: result.amount,
                currency: "INR",
                order_id: result.razorpay_order_id,
                handler: function (response) {
                    console.log("Payment successful", response);
                    const paymentDetails = {
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    };


                    const res_two = fetch('/api/razorpay/verify-order', { method: 'POST', body: JSON.stringify(paymentDetails) });
                    console.log(res_two)
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "1234567890",
                },
                theme: {
                    color: "#F37254",
                },
            });

            paymentObject.open();

        } catch (error) {
            alert("Error processing the order: " + error.message);
        }
    };

    useEffect(() => {
        console.log(token);
    },[])

    useEffect(() => {
        razorPayScript("https://checkout.razorpay.com/v1/checkout.js")
            .then(() => setScriptLoaded(true))
            .catch((error) => alert(error.message));
    }, [data]);


    return (
        <>
            <div className="place-order">
                <div className="left-container">
                    <div className="user-data">
                        <div className="input">
                            <input onChange={(e) => setData((prev) => ({...prev, firstName: e.target.value}))} type="text" placeholder="First name" name="fname" id="fname" />
                            <input onChange={(e) => setData((prev) => ({...prev, lastName: e.target.value}))} type="text" placeholder="Last name" name="lname" id="lname" />
                        </div>
                        <input type="email" placeholder="Email" name="email" id="email" />
                        <textarea style={{ padding: "5px", minHeight: "120px", outlineColor: 'darkgreen' }} name="fulladdress" id="fulladdress" placeholder="Home address" ></textarea>
                        <div className="input">
                            <input type="text" name="street" id="street" placeholder="Street" />
                            <input type="text" name="city" id="city" placeholder="City" />
                        </div>
                        <input type="number" name="zipcode" id="zipcode" placeholder="Zipcode" />
                        <div className="item-info">
                            <div className="cart-amount">
                                <p>Total Cart Amount</p><p>&#8377; {totalPrice.toFixed(2)}</p>
                            </div>
                            <hr />
                            <div className="cart-amount">
                                <p>Shipping Charge</p>
                                <p>&#8377; {(totalPrice * 0.15).toFixed(2)}</p>
                            </div>
                            <hr />
                            <div style={{ fontWeight: 'bold' }} className="cart-amount">
                                <p>Total Amount</p>
                                <p>&#8377; {(totalPrice * 0.15 + totalPrice).toFixed(2)}</p>
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
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
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
