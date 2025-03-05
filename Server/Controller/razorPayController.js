import { razorPayInstance } from "../Config/razorPayConfig.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
import userModel from "../Models/userModel.js";
import shopProductModel from "../Models/shopProductModel.js";
import orderModel from "../Models/orderModel.js";

dotenv.config();
const razorPayKeyId = process.env.RAZORPAY_KEY_ID;
const razorPayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export const createRazorPayOrderController = async (req, res) => {
  try {
    if (!razorPayKeyId || !razorPayKeySecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay credentials not found",
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, lastName, email, street, city, state, fulladdress, zipcode, phone } = req.body;

    if (!firstName || !lastName || !email || !street || !city || !state || !fulladdress || !zipcode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(zipcode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ZIP code. Must be a 6-digit number",
      });
    }

    // Phone number validation (assuming 10-digit Indian numbers)
    // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phone)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid phone number. Must be a 10-digit number",
    //   });
    // }

    // Validate cart data
    const userCartData = user.cartData;
    if (!userCartData || userCartData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const productDetails = [];

    // Fetch product details and calculate total amount
    for (const item of userCartData) {
      const product = await shopProductModel.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }
      totalAmount += Number(product.price) * Number(item.quantity);
      productDetails.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create a Razorpay instance and order
    const rPI = razorPayInstance(razorPayKeyId, razorPayKeySecret);
    const options = {
      amount: Number(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${user._id}`,
    };
    const razorpayOrder = await rPI.orders.create(options);

    // Save order in database
    const newOrder = new orderModel({
      userId: user._id,
      cartData: productDetails,
      amount: totalAmount,
      address: {
        firstName,
        lastName,
        email,
        street,
        fulladdress,
        city,
        state,
        zipcode,
        phone,
      },
      status: "Pending",
      payment: false,
      razorpayOrder: {
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount / 100,
      },
    });

    await newOrder.save();
    console.log(newOrder);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
      razorpayOrder,
    });

  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({
      success: false,
      message: `Razorpay order creation failed: ${err.message}`,
    });
  }
};



export const verifyRazorPayOrderController = async (req, res) => {
  try {
    // const userId = req.user;
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const hmac = crypto.createHmac("sha256", razorPayKeySecret);
    hmac.update(`${order_id}|${payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const order = await orderModel.findOne({ "razorpayOrder.id": order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = "Pending";
    order.payment = true;
    await order.save();

    const user = await userModel.findById(order.userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.cartData = [];




    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully, cart cleared",
    });

  } catch (error) {
    console.error("Error verifying Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: `Payment verification failed: ${error.message}`
    });
  }
};

