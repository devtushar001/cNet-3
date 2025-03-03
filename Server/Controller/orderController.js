import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    cartData: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      }
    ],

    amount: { type: Number, required: true },

    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
      phone: { type: String, required: true },
    },

    status: { type: String, default: "Pending", enum: ["Pending", "Shipped", "Delivered", "Cancelled"] },

    payment: { type: Boolean, default: false },

    razorpayOrder: {
      id: { type: String, required: true },
      currency: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
