import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
import { toast } from "react-toastify";
import { TShakyaContext } from "../../Context/TShakyContext";
import ImageUploader from "../../Components/ImageUploader/ImageUploader";
import TextEditor from "../../Components/TextEditor/TextEditor";

const Products = () => {
    const { backend_url } = useContext(TShakyaContext);
    const [fetchData, setFetchData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categoryImage, setCategoryImage] = useState({
        type: "single",
        selection: false,
        image: null
    });

    const [featuredImage, setFeaturedImage] = useState({
        type: "single",
        selection: false,
        image: null
    });

    const [galleryImage, setGalleryImage] = useState({
        type: "multiple",
        selection: false,
        image: []
    });

    const [shopCategory, setShopCategory] = useState({
        shopCategoryName: "",
        shopCategoryImage: null,
    });


    const [shopProduct, setShopProduct] = useState({
        featuredImg: "",
        galleryImg: galleryImage.image,
        title: "",
        shopCategory: "",
        brand: "",
        stock: "",
        price: "",
        description: "",
        content: ""
    });

    useEffect(() => {
        console.log(shopProduct)
    },[shopProduct])

    useEffect(() => {
        const fetchShopCategory = async () => {
            try {
                const response = await fetch(`${backend_url}/api/shop-category/get-all`);
                const result = await response.json();

                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                setFetchData(result.shopCategories);
            } catch (error) {
                toast.error("Error fetching categories");
            }
        };

        fetchShopCategory();
    }, [backend_url]);

    const createShopCategory = async () => {
        if (!shopCategory.shopCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!categoryImage.image) {
            toast.error("Please upload an image");
            return;
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

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            setFetchData((prev) => [...prev, { shopCategoryName: shopCategory.shopCategoryName }]);

            setShopCategory({ shopCategoryName: "", shopCategoryImage: null });
            setCategoryImage({ type: "single", selection: false, image: null });

        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    return (
        <div className="add-product">
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
                            <input
                                type="submit"
                                value="Select image"
                                onClick={() => setCategoryImage((prev) => ({ ...prev, selection: true }))}
                            />
                        )}
                    </div>
                    <div className="category-data">
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={shopCategory.shopCategoryName}
                            onChange={(e) => setShopCategory((prev) => ({ ...prev, shopCategoryName: e.target.value }))}
                        />
                        <button onClick={createShopCategory}>Submit</button>
                    </div>
                </div>
            </div>
            {categoryImage.selection && <ImageUploader object={categoryImage} imageSelector={setCategoryImage} />}
            <div className="product-content">
                <div className="fetuered-image">
                    {featuredImage.image ? (
                        <>
                            <img src={featuredImage.image} alt="Category" onChange={(e) => { setShopCategory((prev) => ({ ...prev, featuredImg: featuredImage.img })) }} />
                            <button onClick={() => setFeaturedImage({ type: "single", selection: false, image: null })}>Remove</button>
                        </>
                    ) : (
                        <input
                            type="submit"
                            value="Select image"
                            onClick={() => setFeaturedImage((prev) => ({ ...prev, selection: true }))}
                        />
                    )}
                </div>
                <input onChange={(e) => { setShopProduct((prev) => ({ ...prev, title: e.target.value })) }} id="title" type="text" placeholder="Enter product title" />
                {featuredImage.selection && <ImageUploader object={featuredImage} imageSelector={setFeaturedImage} />}
                <TextEditor />
            </div>
            <div className="others-details">
                <div className="inputs">
                    <select
                        name="category"
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setShopProduct((prev) => ({ ...prev, shopCategory: e.target.value }))}
                    >
                        <option value="">Select a category</option>
                        {fetchData.map((item, i) => (
                            <option key={i} value={item.shopCategoryName}>{item.shopCategoryName}</option>
                        ))}
                    </select>
                    <input value={shopProduct.brand} onChange={(e) => setShopProduct((prev) => ({ ...prev, brand: e.target.value }))} type="text" placeholder="Brand" />
                    <input value={shopProduct.stock} onChange={(e) => setShopProduct((prev) => ({ ...prev, stock: e.target.value }))} type="number" placeholder="Stock" />
                    <input value={shopProduct.price} onChange={(e) => setShopProduct((prev) => ({ ...prev, price: e.target.value }))} type="number" placeholder="Price" />
                </div>
                <textarea value={shopProduct.description} onChange={(e) => setShopProduct((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" name="description" id="description"></textarea>
            </div>
            <div className="gallery-images">
                <button id="gallry" onClick={() => setGalleryImage((prev) => ({ ...prev, selection: true }))}>Add gallery</button>
                {galleryImage.image.map((item, i) => {
                    return (
                        <img src={item} key={i} />
                    )
                })}
                {galleryImage.selection && <ImageUploader object={galleryImage} imageSelector={setGalleryImage} />}
            </div>
        </div>
    );
};

export default Products;