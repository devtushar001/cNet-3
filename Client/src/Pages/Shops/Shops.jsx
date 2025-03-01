import React, { useContext, useEffect, useState } from "react";
import './Shops.css';
import { Link } from "react-router-dom";
import { EscomContext } from "../../Context/escomContext";

const Shops = () => {
  const { shopCat, backend_url, productData, setProductData } = useContext(EscomContext);

  const fetchShopProduct = async () => {
    try {
      const response = await fetch(`${backend_url}/api/shop-products/get-all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setProductData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchShopProduct();
  }, [backend_url, shopCat]); // Ensures it runs when dependencies change

  const relatedProducts = productData.filter((data) =>
    shopCat === 'All' || shopCat === data.category
  );

  const latestProduct = relatedProducts.length > 0
    ? relatedProducts[relatedProducts.length - 1]
    : null;

  useEffect(() => {
    console.log(latestProduct);
  }, [latestProduct]);

  const handlePurchase = (id) => {
    alert(`Purchase functionality for product ID: ${id} coming soon!`);
  };

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
        {relatedProducts.map((data) => (
          <div key={data._id} className="single-product">
            <img src={data.featuredImg} alt={data.title} />
            <p>{data.title}</p>
            <div className="btns">
              <Link className="no-style view" to={`/shops/${data._id}`}>
                <button className="view">View</button>
              </Link>
              <button className="purchase" onClick={() => handlePurchase(data._id)}>Purchase</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Shops;
