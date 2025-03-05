import React, { createContext, useState, useEffect } from "react";
import { escomData } from '../assets/escomData';
import { toast } from "react-toastify";

export const EscomContext = createContext(null);

const EscomContextProvider = ({ children }) => {
  const [navbar, setNavbar] = useState(false);
  const [data, setData] = useState("");
  const [toolsComponents, setToolsComponents] = useState({});
  const [sideBar, setSideBar] = useState(false);
  const [searchPage, setSearchPage] = useState(false);
  const [getValue, setGetValue] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [courseCat, setCourseCat] = useState('All');
  const [blogCat, setBlogCat] = useState('All');
  const [shopCat, setShopCat] = useState('All');
  const [cartItem, setCartItem] = useState([]);

  const backend_url = "http://localhost:10017";

  // Get user & token from localStorage
  const getUser = localStorage.getItem('user');
  const token = JSON.parse(localStorage.getItem('token'));
  const user = JSON.parse(getUser);

  // Load cartData from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      setCartData(JSON.parse(storedCart));
    }
  }, []);

  // Save cartData to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }, [cartData]);

  const getFetchData = async () => {
    try {
      const response = await fetch(`${backend_url}/api/text-edit/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setGetValue(data);
    } catch (error) {
      alert("Failed to fetch data");
    }
  };

  const deleteContent = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/text-edit/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setGetValue((prev) => prev.filter(content => content._id !== id));
      } else {
        toast.error("Failed to delete content");
      }
    } catch (error) {
      alert("Failed to delete content");
    }
  };

  // Add product to cart
  const addToCart = (productId) => {
    if (!user) {
      toast.error("Login First");
      return;
    }
    setCartData((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      return existingItem
        ? prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
        : [...prevCart, { productId, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    if (!user) {
      toast.error("Login First");
      return;
    }
    setCartData((prevCart) => {
      return prevCart
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  useEffect(() => {
    const toolComponents = escomData.reduce((acc, item) => {
      acc[item._id] = item.url;
      return acc;
    }, {});
    setToolsComponents(toolComponents);
    getFetchData();
  }, []);

  const contextValue = {
    data,
    setData,
    escomData,
    toolsComponents,
    setSideBar,
    sideBar,
    backend_url,
    searchPage,
    setSearchPage,
    getValue,
    deleteContent,
    getFetchData,
    navbar,
    setNavbar,
    blogCat,
    setBlogCat,
    courseCat,
    setCourseCat,
    shopCat,
    setShopCat,
    addToCart,
    removeFromCart,
    cartData,
    setCartData,
    user,
    token,
    productData,
    setProductData,
    cartItem,
    setCartItem,
  };

  return (
    <EscomContext.Provider value={contextValue}>
      {children}
    </EscomContext.Provider>
  );
};

export default EscomContextProvider;
