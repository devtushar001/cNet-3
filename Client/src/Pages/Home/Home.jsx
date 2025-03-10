import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";
import { assets } from "../../assets/escomData";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1583&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1583&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
  ];


  const offerings = [
    {
      title: "UI Templates",
      description: "High-quality, customizable UI templates for your web projects. Perfect for developers and businesses looking to accelerate development.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "Web Applications",
      description: "Ready-to-use web apps tailored to various business needs, including e-commerce, CMS, and more.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "IoT Controlling Websites",
      description: "Smart IoT-enabled web applications to control and monitor devices remotely, offering seamless automation.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "ChatWeb",
      description: "A real-time chat application for seamless communication, perfect for businesses and personal use.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "Smart Calculator",
      description: "An advanced online calculator with multiple features, designed for quick and accurate calculations.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "Docs",
      description: "A powerful online document editor for creating, sharing, and collaborating on documents in real-time.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    },
    {
      title: "Sheets",
      description: "An online spreadsheet tool to manage data efficiently with advanced formulas and collaboration features.",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1583&auto=format&fit=crop",
    }
  ];

  return (
    <>
      <div className="home">
        <div className="image-slider">
          <img src={images[1]} alt="" />
        </div>
        <div className="page-details"></div>
        <section className="home-section">
          <div className="content">
            <h2>Professional UI Templates</h2>
            <p>
              Get high-quality UI templates designed for modern web applications. Our templates are easy to integrate, responsive, and optimized for performance.
            </p>
            <Link to={`/shops`}><button className="btn">Explore Templates</button></Link> 
          </div>
          <div className="image">
            <img style={{ height: "330px" }} src={assets.layout_icon} alt="UI Templates" />
          </div>
        </section>

        <section className="home-section reverse">
          <div className="content">
            <h2>Web Applications</h2>
            <p>
              We develop custom web applications tailored to your business needs. Our solutions are scalable, secure, and user-friendly.
            </p>
             <Link to={`/web-apps`}> <button className="btn">Get Your Web App</button></Link>  
          </div>
          <div className="image">
            <img style={{ height: "330px" }} src={assets.app_development_icon} alt="Web Applications" />
          </div>
        </section>
        <section className="home-section hire-me">
          <div className="content">
            <h2>Hire Me</h2>
            <p>Looking for a skilled developer? I am available for freelance projects, custom development, and consulting.</p>
           <Link to={`/hire-me`}>  <button className="btn">Contact Me</button></Link>
          </div>
          <div className="image">
            <img style={{ height: "330px" }}  src={assets.me_one} alt="Hire Me" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
