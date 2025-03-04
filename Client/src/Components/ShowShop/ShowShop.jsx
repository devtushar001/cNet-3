import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ShowShop.css";
import { EscomContext } from "../../Context/escomContext";
import { toast } from "react-toastify";

const ShowShop = () => {
    const { shopId } = useParams();
    const { addToCart, setCartData, removeFromCart, cartData, token, backend_url } = useContext(EscomContext);
    const [singleProduct, setSingleProduct] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchSingleShopProduct = async () => {
        try {
            const response = await fetch(`${backend_url}/api/shop-products/get-single?shopId=${shopId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
            const data = await response.json();
            setSingleProduct(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchSingleShopProduct();
    }, [shopId]);

    useEffect(() => {
        if (singleProduct) {
            const foundProduct = cartData?.find(item => item.productId === singleProduct._id);
            setCartQuantity(foundProduct ? foundProduct.quantity : 0);
        }
    }, [cartData, singleProduct]);

    if (!singleProduct) return <h2 className="error-message">Product not found!</h2>;

    const isOutOfStock = cartQuantity >= singleProduct.stock;

    const handlePurchase = () => {
        if (cartQuantity === 0) {
            toast.error("Please add the product first");
            return;
        }
        navigate("/place-order");
    };

    const updateCart = async (productId, action) => {
        try {
            const response = await fetch(`${backend_url}/api/user-cart/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (data.success) {
                setCartData(data.cart);
                toast.success(`Product ${action === "add" ? "added to" : "removed from"} cart!`);
            } else {
                toast.error("Cart update failed.");
            }
        } catch (error) {
            toast.error("Failed to update cart. Please try again.");
        }
    };

    return (
        <div className="show-shop-product">
            <div className="left-cont">
                <img src={singleProduct?.featuredImg} alt={singleProduct?.title || "Product Image"} />
                <div className="gallery-image">
                    {singleProduct?.galleryImg?.map((single_img, i) => (
                        <img key={i} src={single_img} alt={`Gallery ${i}`} />
                    ))}
                </div>
            </div>
            <div className="right-cont">
                <h1>{singleProduct?.title}</h1>
                <p>{singleProduct?.description}</p>
                <span>Available Stock: {singleProduct?.stock}</span>
                <h2>&#8377; {singleProduct?.price}</h2>

                <div className="quantity">
                    {cartQuantity > 0 && (
                        <div onClick={() => { removeFromCart(singleProduct._id); updateCart(singleProduct._id, "remove"); }}>
                            -
                        </div>
                    )}
                    <div>{cartQuantity}</div>
                    <div
                        onClick={() => { addToCart(singleProduct._id); updateCart(singleProduct._id, "add"); }}
                        style={{ pointerEvents: isOutOfStock ? "none" : "auto", opacity: isOutOfStock ? 0.2 : 1 }}
                    >
                        +
                    </div>
                </div>

                <div className="buttons">
                    <button
                        onClick={() => { addToCart(singleProduct._id); updateCart(singleProduct._id, "add"); }}
                        style={{ pointerEvents: isOutOfStock ? "none" : "auto", opacity: isOutOfStock ? 0.2 : 1 }}
                    >
                        Add to cart
                    </button>
                    <button
                        onClick={handlePurchase}
                        style={{ opacity: cartQuantity === 0 ? 0.2 : 1 }}
                        disabled={cartQuantity === 0}
                    >
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowShop;
