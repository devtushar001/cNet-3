import React, { useState, useEffect } from "react";
import "./ProductDetails.css"; // Import CSS

const backend_url = "http://localhost:10017"; // Update with actual backend URL

const ProductDetails = () => {
    const [productData, setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch shop products
    const fetchShopProduct = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backend_url}/api/shop-products/get-all?page=${page}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();

            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
            setTotalProducts(result.totalProducts);
            setProductData(result.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopProduct(currentPage);
    }, [currentPage]);

    // Delete product
    const deleteShopProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${backend_url}/api/shop-products/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Product deleted successfully!");
                // Remove product from state after deletion
                setProductData((prevData) => prevData.filter((product) => product._id !== productId));
            } else {
                alert(`Failed to delete product: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("An error occurred while deleting the product.");
        }
    };

    return (
        <div className="product-container">
            <h2 className="title">Shop Products</h2>

            {loading && <p className="loading">Loading products...</p>}
            {error && <p className="error">Error: {error}</p>}

            {!loading && !error && productData.length === 0 && <p className="no-products">No products found.</p>}

            <div className="product-grid">
                {productData.map((product) => (
                    <div key={product._id} className="product-card">
                        <h3 className="product-name">{product.title}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">₹{product.price}</p>
                        <button className="delete-btn" onClick={() => deleteShopProduct(product._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="btn prev"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn next"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
