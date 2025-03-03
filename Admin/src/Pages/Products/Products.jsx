import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
import { toast } from "react-toastify";
import { TShakyaContext } from "../../Context/TShakyContext";
import ImageUploader from "../../Components/ImageUploader/ImageUploader";
import TextEditor from "../../Components/TextEditor/TextEditor";

const Products = () => {
    const { backend_url, content } = useContext(TShakyaContext);
    const [fetchData, setFetchData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categoryImage, setCategoryImage] = useState({ type: "single", selection: false, image: null });
    const [featuredImage, setFeaturedImage] = useState({ type: "single", selection: false, image: null });
    const [galleryImage, setGalleryImage] = useState({ type: "multiple", selection: false, image: [] });

    const [shopCategory, setShopCategory] = useState({ shopCategoryName: "", shopCategoryImage: null });
    const [shopProduct, setShopProduct] = useState({
        featuredImg: null,
        galleryImg: [],
        title: "",
        shopCategory: "",
        brand: "",
        stock: "",
        price: "",
        description: "",
        content: "",
    });

    useEffect(() => {
        setShopProduct((prev) => ({
            ...prev,
            featuredImg: featuredImage.image,
            galleryImg: galleryImage.image,
            content: content
        }));
    }, [featuredImage.image, galleryImage.image, content]);

    useEffect(() => {
        const fetchShopCategory = async () => {
            try {
                const response = await fetch(`${backend_url}/api/shop-category/get-all`);
                const result = await response.json();
                if (result.success) {
                    setFetchData(result.shopCategories);
                } else {
                    toast.error(result.message);
                }
            } catch {
                toast.error("Error fetching categories");
            }
        };
        fetchShopCategory();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopProduct((prev) => ({ ...prev, [name]: value }));
    };

    const createNewProduct = async () => {
        if (!shopProduct.title || !shopProduct.shopCategory || !shopProduct.price || !shopProduct.stock || !shopProduct.description || !shopProduct.featuredImg) {
            return toast.error("Please fill all required fields");
        }

        try {
            const response = await fetch(`${backend_url}/api/shop-products/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(shopProduct),
            });

            const data = await response.json();
            data.success ? toast.success(data.message) : toast.error(data.message);
        } catch {
            toast.error("Failed to create product");
        }
    };

    const createShopCategory = async () => {
        if (!shopCategory.shopCategoryName.trim() || !categoryImage.image) {
            return toast.error("Category name and image are required");
        }

        try {
            const response = await fetch(`${backend_url}/api/shop-category/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopCategoryName: shopCategory.shopCategoryName,
                    shopCategoryImage: categoryImage.image,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setFetchData([...fetchData, { _id: data.category._id, shopCategoryName: data.category.shopCategoryName }]);
                setShopCategory({ shopCategoryName: "", shopCategoryImage: null });
                setCategoryImage({ type: "single", selection: false, image: null });
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to create category");
        }
    };

    return (
        <div className="add-product">
            {shopProduct.title && shopProduct.shopCategory && shopProduct.price && shopProduct.stock && shopProduct.description && shopProduct.featuredImg && (
                <button id="create-product" onClick={createNewProduct}>Create Product</button>
            )}

            <div className="category-contianer">
                <div className="create-new-category">
                    <h2>Create new category</h2>
                    <div className="image">
                        {categoryImage.image ? (
                            <>
                                <img src={categoryImage.image} alt="Category" />
                                <button onClick={() => setCategoryImage({ type: "single", selection: false, image: null })}>Remove</button>
                            </>
                        ) : (
                            <input type="submit" value="Select image" onClick={() => setCategoryImage((prev) => ({ ...prev, selection: true }))} />
                        )}
                    </div>
                    <div className="category-data">
                        <input type="text" placeholder="Enter category name" value={shopCategory.shopCategoryName} onChange={(e) => setShopCategory((prev) => ({ ...prev, shopCategoryName: e.target.value }))} />
                        <button onClick={createShopCategory}>Submit</button>
                    </div>
                </div>
            </div>
            {categoryImage.selection && <ImageUploader object={categoryImage} imageSelector={setCategoryImage} />}

            <div className="product-content">
                <div className="fetuered-image">
                    {featuredImage.image ? (
                        <>
                            <img src={featuredImage.image} alt="Featured" />
                            <button onClick={() => setFeaturedImage({ type: "single", selection: false, image: null })}>Remove</button>
                        </>
                    ) : (
                        <input type="submit" value="Select image" onClick={() => setFeaturedImage((prev) => ({ ...prev, selection: true }))} />
                    )}
                </div>
                {featuredImage.selection && <ImageUploader object={featuredImage} imageSelector={setFeaturedImage} />}
                <input name="title" value={shopProduct.title} onChange={handleChange} id="title" type="text" placeholder="Enter product title" />
                <TextEditor />
            </div>

            <div className="others-details">
                <div className="inputs">
                    <select name="shopCategory" id="category" value={shopProduct.shopCategory} onChange={handleChange}>
                        <option>Select a category</option>
                        {fetchData.map((item) => (
                            <option key={item._id} value={item.shopCategoryName}>{item.shopCategoryName}</option>
                        ))}
                    </select>
                    <input name="brand" value={shopProduct.brand} onChange={handleChange} type="text" placeholder="Brand" />
                    <input name="stock" value={shopProduct.stock} onChange={handleChange} type="number" placeholder="Stock" />
                    <input name="price" value={shopProduct.price} onChange={handleChange} type="number" placeholder="Price" />
                </div>
                <textarea name="description" value={shopProduct.description} onChange={handleChange} placeholder="Description" />
            </div>

            <div className="gallery-images">
                <button id="gallry" onClick={() => setGalleryImage((prev) => ({ ...prev, selection: true }))}>Add gallery</button>
                {galleryImage.image.map((img, i) => <img src={img} key={i} alt="Gallery" />)}
            </div>
            {galleryImage.selection && <ImageUploader object={galleryImage} imageSelector={setGalleryImage} />}
        </div>
    );
};

export default Products;
