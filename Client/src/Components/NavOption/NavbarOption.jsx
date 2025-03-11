import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavbarOption.css';
import { EscomContext } from '../../Context/escomContext';
import { blogsCategory, courseCategory, escomData } from '../../assets/escomData';
import { imageData } from '../../assets/dochakiData';

const NavbarOption = () => {
   const { setNavbar, setBlogCat, setCourseCat, setShopCat, user, backend_url, navbar } = useContext(EscomContext);
   const [shopCategory, setShopCategory] = useState([]);

   useEffect(() => {
      const fetchShopCategory = async () => {
         try {
            const response = await fetch(`${backend_url}/api/shop-category/get-all`);
            const result = await response.json();
            if (result.success) {
               setShopCategory(result.shopCategories);
            }
         } catch {
            console.error("Error fetching categories");
         }
      };
      fetchShopCategory();
   }, [backend_url]);

   return (
      <nav className="navbar-option">
         <ul className="navbar-option__menu">
            <li><Link className='no-style' onClick={() => setNavbar(false)} to="/">Home</Link></li>
            <li className="navbar-option__dropdown">
               <Link className='no-style' to='/shops' onClick={() => { setNavbar(false); setShopCat('All') }}>UI-Templates</Link>
               <ul className="navbar-option__dropdown-menu">
                  {shopCategory.map(({ _id, shopCategoryName }) => (
                     <li key={_id}>
                        <Link className='no-style' onClick={() => { setNavbar(false); setShopCat(shopCategoryName) }} to='/shops'>
                           {shopCategoryName}
                        </Link>
                     </li>
                  ))}
               </ul>
            </li>
            <li className="navbar-option__dropdown">
               <Link className='no-style' to="/web-apps" onClick={() => setNavbar(false)}>Web Apps</Link>
               <ul className="navbar-option__dropdown-menu">
                  {courseCategory.map(({ _id, name }) => (
                     <li key={_id}>
                        <Link className='no-style' onClick={() => setNavbar(false)} to={`/courses/${_id}`}>{name}</Link>
                     </li>
                  ))}
               </ul>
            </li>
            <li><Link className='no-style' onClick={() => setNavbar(false)} to="/hire-me">Hire me</Link></li>
            {/* <li className="navbar-option__dropdown">
               <Link className='no-style' to='/projects' onClick={() => setNavbar(false)}>Free-Projects</Link>
               <ul className="navbar-option__dropdown-menu">
                  {escomData.map(({ _id, name }) => (
                     <li key={_id}>
                        <Link className='no-style' onClick={() => setNavbar(false)} to={`/projects/${_id}`}>{name}</Link>
                     </li>
                  ))}
               </ul>
            </li> */}
            <li className="navbar-option__dropdown">
               <Link className='no-style' to='/blogs' onClick={() => { setNavbar(false); setBlogCat('All') }}>Blogs</Link>
               <ul className="navbar-option__dropdown-menu">
                  {blogsCategory.map(({ _id, name }) => (
                     <li key={_id}>
                        <Link className='no-style' onClick={() => { setNavbar(false); setBlogCat(name) }} to='/blogs'>{name}</Link>
                     </li>
                  ))}
               </ul>
            </li>
            <li><Link className='no-style' onClick={() => setNavbar(false)} to="/videos">Videos</Link></li>
            <li><Link className='no-style' onClick={() => setNavbar(false)} to="/about-me">About me</Link></li>

         </ul>
         <div className="links">
            {navbar ?
               <>
                  <Link style={{ marginTop: "5px" }} to='/search-querry'><img src={imageData.search_icon} alt="Search Icon" /></Link>
                  <Link style={{ marginTop: "5px" }} to='/contact-us'> <img src={imageData.location_icon} alt="Location Icon" /></Link>
               </>
               : ""}
            {!user ? <Link className='no-style' to='/login-signup'><button className="navbar-option__button">Login</button></Link> :
               <Link className='no-style' to='/user-profile'><button className="navbar-option__button">Welcome {user.name.slice(0, 5)}...</button></Link>}
         </div>
      </nav>
   );
};

export default NavbarOption;
