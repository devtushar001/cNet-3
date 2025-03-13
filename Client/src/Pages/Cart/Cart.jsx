import React, { useContext, useEffect, useCallback } from "react";
import { EscomContext } from "../../Context/escomContext";
import { Link } from "react-router-dom";
import './Cart.css';

const Cart = () => {
    const { cartData, setCartData, backend_url, token } = useContext(EscomContext);

    const getCart = useCallback(async () => {
        try {
            const response = await fetch(`${backend_url}/api/user-cart/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                console.log(response)
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setCartData(data.cart);
        } catch (error) {
            console.error("Failed to fetch cart data:", error.message);
        }
    }, [backend_url, token, setCartData]);

    useEffect(() => {
        getCart();
    }, [getCart]);

    return (
        <>
            <div className="cart-container">
                {cartData.length > 0 ? (
                    cartData.map(item => (
                        <div key={item._id} className="cart-item">
                            <Link to={`/shops/${item._id}`}>
                                <img
                                    src={item.featuredImg}
                                    alt={`Image of ${item.title}`}
                                    className="cart-item-image"
                                />
                            </Link>
                            <div className="cart-item-details">
                                <h3>{item.title}</h3>
                                <p>Price: &#8377; {Number(item.price).toFixed(2)}</p>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-cart">
                        <p>No items in cart</p>
                        <Link to="/shops" className="shop-now-btn">Go to Shop</Link>
                    </div>
                )}
            </div>
            <div className="place-order-button">
                <Link to="/place-order">
                <button className="place-order-btn">Place Order</button>
                </Link>
            </div>
        </>
    );
}

export default Cart;
