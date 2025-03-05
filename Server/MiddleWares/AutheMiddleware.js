import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User Not Authenticated. No token provided.",
      });
    }

    const decodedData = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodedData._id);

    if (!req.user) return res.status(400).json({
      success: false,
      message: `User not found`
    })

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Login first, add to cart",
    });
  }
};