import React, { createContext, useState, useEffect, useMemo } from "react";
import { escomData } from "../assets/escomData";
import { toast } from "react-toastify";

export const EscomContext = createContext(null);

const EscomContextProvider = ({ children }) => {
  const [navbar, setNavbar] = useState(false);
  const [data, setData] = useState("");
  const [toolsComponents, setToolsComponents] = useState({});
  const [sideBar, setSideBar] = useState(false);
  const [searchPage, setSearchPage] = useState(false);
  const [getValue, setGetValue] = useState([]);
  const [cartData, setCartData] = useState(() => {
    return JSON.parse(localStorage.getItem("cartData")) || [];
  });
  const [productData, setProductData] = useState([]);
  const [courseCat, setCourseCat] = useState("All");
  const [blogCat, setBlogCat] = useState("All");
  const [shopCat, setShopCat] = useState("All");
  const [cartItem, setCartItem] = useState([]);

  // const backend_url = "http://localhost:10017";
  const backend_url = "https://techkart-backend.onrender.com"

  const getUser = localStorage.getItem("user");
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(getUser);

  const readDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }, [cartData]);

  const getFetchData = async () => {
    try {
      const response = await fetch(`${backend_url}/api/text-edit/get`);
      const data = await response.json();
      setGetValue(data);
    } catch (error) {
      toast.error("Failed to fetch data");
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
        setGetValue((prev) => prev.filter((content) => content._id !== id));
      } else {
        toast.error("Failed to delete content");
      }
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const addToCart = (productId) => {
    if (!user) {
      toast.error("Login First");
      return;
    }

    setCartData((prevCart) =>
      prevCart.some((item) => item.productId === productId)
        ? prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [...prevCart, { productId, quantity: 1 }]
    );
  };

  const removeFromCart = (productId) => {
    if (!user) {
      toast.error("Login First");
      return;
    }

    setCartData((prevCart) =>
      prevCart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  useEffect(() => {
    setToolsComponents(
      escomData.reduce((acc, item) => {
        acc[item._id] = item.url;
        return acc;
      }, {})
    );
    getFetchData();
  }, []);

  const contextValue = useMemo(
    () => ({
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
      readDate,
    }),
    [
      data,
      toolsComponents,
      sideBar,
      searchPage,
      getValue,
      navbar,
      blogCat,
      courseCat,
      shopCat,
      cartData,
      user,
      token,
      productData,
      cartItem,
    ]
  );

  return (
    <EscomContext.Provider value={contextValue}>
      {children}
    </EscomContext.Provider>
  );
};

export default EscomContextProvider;
