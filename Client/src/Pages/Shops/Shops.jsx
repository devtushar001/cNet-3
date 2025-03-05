import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { EscomContext } from "../../Context/escomContext";
import "./Shops.css";

const Shops = () => {
  const { shopCat, backend_url, productData, setProductData } = useContext(EscomContext);

  useEffect(() => {
    const fetchShopProduct = async () => {
      try {
        const response = await fetch(`${backend_url}/api/shop-products/get-all`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setProductData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchShopProduct();
  }, [backend_url]); // Removed shopCat to avoid unnecessary refetching

  const relatedProducts = shopCat === "All" 
    ? productData 
    : productData.filter((data) => data.category === shopCat);

  const latestProduct = relatedProducts.at(-1); // More concise

  const handlePurchase = (id) => alert(`Purchase functionality for product ID: ${id} coming soon!`);

  return (
    <>
      <div 
        style={{ backgroundImage: latestProduct?.featuredImg ? `url('${latestProduct.featuredImg}')` : "none" }}
        className="shops"
      >
        <div className="over-lap"></div>
        {latestProduct ? <h1>{latestProduct.title}</h1> : <p>No products available</p>}
        {latestProduct && (
          <Link to={`/shops/${latestProduct._id}`}>
            <button className="read-more">View Details</button>
          </Link>
        )}
        <div className="shops-overlap"></div>
      </div>

      <div className="all-products">
        {relatedProducts.map(({ _id, featuredImg, title }) => (
          <div key={_id} className="single-product">
            <img src={featuredImg} alt={title} />
            <p>{title}</p>
            <div className="btns">
              <Link className="no-style view" to={`/shops/${_id}`}>
                <button className="view">View</button>
              </Link>
              <button className="purchase" onClick={() => handlePurchase(_id)}>Purchase</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Shops;
