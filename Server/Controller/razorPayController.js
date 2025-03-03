import { razorPayInstance } from "../Config/razorPayConfig.js";
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();
const razorPayKeyId = process.env.RAZORPAY_KEY_ID
const razorPayKeySecret = process.env.RAZORPAY_KEY_SECRET

export const createRazorPayOrderController = async (req, res) => {
  console.log(req.body)
  console.log(req.user);
  if (!razorPayKeyId || !razorPayKeySecret) {
    return res.status(404).json({
      success: false,
      message: `Razorpay credentials not found`
    });
  }

  console.log(razorPayKeyId, razorPayKeySecret);

  const rPI = razorPayInstance(razorPayKeyId, razorPayKeySecret);

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_order_${courseId}`
  };

  try {
    const order = await rPI.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Razorpay order creation failed: ${err.message}`
    });
  }
};


export const verifyRazorPayOrderController = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  if (!order_id || !payment_id || !signature) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const hmac = crypto.createHmac("sha256", razorPayKeySecret);
  hmac.update(`${order_id}|${payment_id}`);

  const rPS = hmac.digest('hex');

  if (rPS === signature) {
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};
