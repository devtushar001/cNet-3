import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {Link} from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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

  return (
    <>
      <div className="home">
        <div className="image-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="swiper-container"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="page-details">
          <div className="first">
            <div className="box">
              <img src={assets.php_icon} alt="" />
              <div className="explore">UI Templates</div>
            </div>
            <div className="box">
              <img src={assets.react_icon} alt="" />
              <div className="explore">IOT Softwares</div>
            </div>
            <div className="box">
              <img src={assets.node_icon} alt="" />
              <div className="explore">Web Apps</div>
            </div>
          </div>
          <div className="second">

            <div className="introduction">
              <img src={assets.me} alt="" />
              <div className="intro">
                <h2>Aboute Me</h2>
                <br />
                <br />
                <p>I am fullstack developer with the MERN Technology.</p>
                <p>You can for your project purposes.</p>
                <br /><br />
                <Link to="/hire-me"><button>View more.</button>
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
