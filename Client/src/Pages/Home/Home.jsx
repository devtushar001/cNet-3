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
        <div className="page-details">
          <div className="first">
            <div className="box">
              <img src={assets.php_icon} alt="" />
              <div className="explore">UI Templates</div>
            </div>
            <div className="box">
              <img src={assets.react_icon} alt="" />
              <div className="explore">IOT Web Apps</div>
            </div>
            <div className="box">
              <img src={assets.node_icon} alt="" />
              <div className="explore">Web Apps</div>
            </div>
          </div>

          <section className="offerings-container">
            <h2>Our Offerings</h2>
            <div className="offerings-grid">
              {offerings.map((item, index) => (
                <div className="offering-card" key={index}>
                  <img src={item.img} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link to="/contact">
                    <button className="explore-btn">Explore</button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
          <div className="second">
            <section className="introduction-container">
              <div className="introduction">
                <div className="image-container">
                  <img src={assets.me} alt="Profile" />
                </div>
                <div className="intro-content">
                  <h2>About Me</h2>
                  <p>
                    I am a passionate <strong>Full-Stack Developer</strong> specializing in the <strong>MERN</strong> stack.
                  </p>
                  <p>
                    If you're looking for a developer to bring your ideas to life, I’m available for your project needs.
                  </p>
                  <Link to="/hire-me">
                    <button className="hire-me-btn">Hire Me</button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
