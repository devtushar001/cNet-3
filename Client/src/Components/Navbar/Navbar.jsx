import React, { useContext } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/escomData";
import { EscomContext } from "../../Context/escomContext";
import { imageData } from "../../assets/dochakiData";

const Navbar = () => {
  const { navbar, setNavbar } = useContext(EscomContext);

  const reloadWebPage = () => {
    window.location.reload()
  };

  return (
    <>
      <div className="navbar">
        <div className="left">
          <div className="menu-icon">
            <img onClick={() => setNavbar(!navbar)} src={!navbar ? imageData.menu_icon : imageData.close_icon} alt="Menu Icon" />
            {!navbar ? <span onClick={() => setNavbar(!navbar)}>Menu</span> : <span onClick={() => setNavbar(!navbar)}>Close</span>}
            {!navbar ?
              <>
                <Link id="links" style={{ marginTop: "5px" }} to='/cart'><img src={assets.cart_icon} alt="Search Icon" /></Link>
                <Link id="links" style={{ marginTop: "5px" }} to='/user-profile'> <img src={assets.user_icon} alt="Location Icon" /></Link>
              </>
              : ""}
          </div>
        </div>
        <div className="right">
          <img onClick={reloadWebPage} src={assets.cNet} alt="techKrt Logo" />
        </div>
      </div>
      <div style={{ height: '71px' }} className="conflict-setup">
      </div>
    </>
  );
};

export default Navbar;
