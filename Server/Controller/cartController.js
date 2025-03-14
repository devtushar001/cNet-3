import shopProductModel from "../Models/shopProductModel.js";
import userModel from "../Models/userModel.js";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let cartData = userData.cartData || [];

        const productIndex = cartData.findIndex(item => item.productId.toString() === String(productId));

        if (productIndex !== -1) {
            cartData[productIndex].quantity += 1;
        } else {
            cartData.push({ productId, quantity: 1 });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { cartData } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: updatedUser.cartData,
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the product to the cart",
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let cartData = userData.cartData || [];

        const productIndex = cartData.findIndex(item => item.productId.toString() === String(productId));

        if (productIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        if (cartData[productIndex].quantity > 1) {
            cartData[productIndex].quantity -= 1;
        } else {
            cartData.splice(productIndex, 1);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { cartData } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart: updatedUser.cartData,
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing the product from the cart",
        });
    }
};


const getCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.user;
        console.log("User ID:", userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user",
            });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found in the database",
            });
        }

        const cartData = await getCartDetails(userData);

        return res.status(200).json({
            success: true,
            message: "Cart data fetched successfully",
            cart: cartData,
        });

    } catch (error) {
        console.error("Error in getCart:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the cart data",
            error: error.message,
        });
    }
};

const getCartDetails = async (userData) => {
    try {
        const carts = userData.cartData || [];

        const productPromises = carts.map(cart => shopProductModel.findById(cart.productId));
        const products = await Promise.all(productPromises);

        return products
            .map((product, index) => product ? ({
                ...product.toObject(),
                quantity: carts[index].quantity,
            }) : null)
            .filter(product => product !== null);

    } catch (error) {
        console.error("Error fetching cart details:", error.message);
        return [];
    }
};

export const cartItem = async (req, res) => {
    try {
        if (!req.user || !req.user.cartData) {
            return res.status(400).json({
                success: false,
                message: "User or cart data not found",
            });
        }

        return res.status(200).json({
            cart: req.user.cartData,
            success: true,
            message: "Cart data retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export { addToCart, removeFromCart, getCart }