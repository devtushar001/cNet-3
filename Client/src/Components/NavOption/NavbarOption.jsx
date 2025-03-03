import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavbarOption.css';
import { EscomContext } from '../../Context/escomContext';
import { assets, blogsCategory, courseCategory, escomData } from '../../assets/escomData';

const NavbarOption = () => {
   const { setNavbar,
      blogCat,
      setBlogCat,
      courseCat,
      setCourseCat,
      shopCat,
      setShopCat, backend_url } = useContext(EscomContext);

   const [shopCategory, setShopCategory] = useState([]);

   useEffect(() => {
      console.log(blogCat);
   }, [blogCat]);


   useEffect(() => {
      const fetchShopCategory = async () => {
         try {
            const response = await fetch(`${backend_url}/api/shop-category/get-all`);
            const result = await response.json();
            console.log(result);
            if (result.success) {
               setShopCategory(result.shopCategories);
            } else {
               toast.error(result.message);
            }
         } catch {
            toast.error("Error fetching categories");
         }
      };
      fetchShopCategory();
   }, []);

   return (
      <div className="navbar-option">
         <ul className="menu-item">
            <li><Link onClick={() => setNavbar(false)} to="/" className="no-style">Home</Link></li>
            <li className="dropdown">
               <span><Link to='/shops' onClick={() => { setNavbar(false); setShopCat('All') }} className="no-style">UI-Templates</Link> </span>
               <ul className="dropdown-menu">
                  {shopCategory.map((shopCatg) => {
                     return (
                        <li key={shopCatg._id}>
                           <Link onClick={() => { setNavbar(false); setShopCat(shopCatg.shopCategoryName) }} to={`/shops`} className="no-style">
                              {shopCatg.shopCategoryName}
                           </Link>
                        </li>
                     )
                  })}
               </ul>
            </li>
            <li className="dropdown">
               <Link onClick={() => setNavbar(false)} to='/projects' className='no-style'><span>Free-Projects</span></Link>
               <ul className="dropdown-menu">
                  {escomData.map((item, i) => {
                     return (
                        <li key={item._id}>
                           <Link onClick={() => setNavbar(false)} to={`/projects/${item._id}`} className="no-style">
                              {item.name}
                           </Link>
                        </li>
                     )
                  })}
               </ul>
            </li>
            <li><Link onClick={() => setNavbar(false)} to="/hire-me" className="no-style">Hire me</Link></li>
            <li className="dropdown">
               <Link onClick={() => setNavbar(false)} to="/courses" className="no-style">Courses</Link>
               <ul className="dropdown-menu">
                  {courseCategory.map((item) => (
                     <li key={item._id}>
                        <Link onClick={() => setNavbar(false)} to={`/courses/${item._id}`} className="no-style">
                           {item.name}
                        </Link>
                     </li>
                  ))}
               </ul>
            </li>

            <li className="dropdown">
               <span><Link to='/blogs' onClick={() => { setNavbar(false); setBlogCat('All') }} className="no-style">Blogs</Link> </span>
               <ul className="dropdown-menu">
                  {blogsCategory.map((blogCat) => {
                     return (
                        <li key={blogCat._id}>
                           <Link
                              onClick={(e) => {
                                 setNavbar(false);
                                 setBlogCat(blogCat.name);
                              }}
                              to={`/blogs`}
                              className="no-style">
                              {blogCat.name}
                           </Link>
                        </li>
                     );
                  })}
               </ul>
            </li>


          

            <li><Link onClick={() => setNavbar(false)} to="/videos" className="no-style">Videos</Link></li>
            <li><Link onClick={() => setNavbar(false)} to="/about-me" className="no-style">About me</Link></li>
         </ul>
      </div>
   );
};

export default NavbarOption;
