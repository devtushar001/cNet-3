import React, { useContext, useEffect } from "react";
import { EscomContext } from "../../Context/escomContext";
import { Link } from "react-router-dom";
import './Cart.css';

const Cart = () => {
    const { cartData } = useContext(EscomContext);

    useEffect(() => {
        console.log("Cart Data Updated:", cartData);
    }, [cartData]); 

    return (
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
    );
}

export default Cart;
