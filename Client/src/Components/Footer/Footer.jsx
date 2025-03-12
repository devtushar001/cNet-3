import React from "react";
import './Footer.css'
import { assets } from "../../assets/escomData";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>

      <div className="footer-container">
        <div className="footer">

          <div className="left">
            <div className="logo">
              <img style={{width: "100%"}} src={assets.cNet} alt="" />
            </div>
            <div id="connection">
              <div className="social-media">
                <img src={assets.youtube_icon} alt="" />
              </div>
              <div className="social-media">
                <img src={assets.facebook_icon} alt="" />
              </div>
              <div className="social-media">
                <img src={assets.insta_icon} alt="" />
              </div>
              <div className="social-media">
                <img src={assets.whatsapp_icon} alt="" />
              </div>
            </div>
          </div>
          <hr />
          <div className="middle">
            <h1>Contents</h1>
            <ul>
              <li><Link className="no-style" to="/">Home</Link> </li>
              <li><Link className="no-style" to="/contact-us">Contact Us</Link> </li>
              <li><Link className="no-style" to="/about-us">About Us</Link> </li>
              <li><Link className="no-style" to="/privacy-policy">Privacy Policy</Link> </li>
              <li><Link className="no-style" to="/projects">Projects</Link> </li>
            </ul>
          </div>
          <hr />
          <div className="right">
            <h1>Connect with us</h1>
            <span>iroc@gmai.com</span>
            <span>+91-984-378-4323</span>
          </div>
        </div>
        <hr />
        <p>Copyright &#169; 2027, cNet all rights reserved</p>
      </div>
    </>
  )
}


export default Footer;