import userModel from "../Models/userModel.js";
import { transporter } from "../Config/nodeMailer.js";
import dotenv from 'dotenv';

dotenv.config();

export const registerController = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    if (!name || !email || !password || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `Email ${email} already exists!`
      });
    }

    const user = await userModel.create({ name, email, password, contact, cartData: [] });

    const token = user.generateToken();
    user.password = undefined;
    const otp = Math.ceil(Math.random()*1000000);
    console.log(otp)
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Hi ${name}, Welcome to TechKrt!`,
      text: `Howdy ${name}! Your account has been created with email ID: ${email}`
    };

    await transporter.sendMail(mailOption);

    return res.status(201).cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "Production",
      httpOnly: true,
      sameSite: "Strict",
    }).json({
      success: true,
      message: "User Registered Successfully",
      token,
      user
    });

  } catch (error) {
    console.error(error.name, error.message);
    res.status(500).json({
      success: false,
      message: "Error in register API",
      error: error.message
    });
  }
};



export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Email or Password is Required."
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found"
      })
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credential."
      })
    }

    const token = user.generateToken();
    user.password = undefined;

    return res.status(200).cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "Development" ? true : false,
      httpOnly: process.env.NODE_ENV === "Development" ? true : false,
      sameSite: process.env.NODE_ENV === "Development" ? true : false,
    }).send({
      success: true,
      message: "User Logined Successfully",
      token,
      user
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error In Login!",
      error
    })
  }
}

export const logoutController = async (req, res) => {
  try {
    res.status(200).cookie('token', "", {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "Development" ? true : false,
      httpOnly: process.env.NODE_ENV === "Development" ? true : false,
      sameSite: process.env.NODE_ENV === "Development" ? true : false,
    }).send({
      success: true,
      message: "User logout successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "logout api problem",
      error
    })
  }
}