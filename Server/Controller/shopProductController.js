import shopProductModel from "../Models/shopProductModel.js";

export const addShopProductController = async (req, res) => {
    try {
        const { featuredImg, galleryImg, title, shopCategory, brand, stock, price, description, content } = req.body;

        // Validate required fields
        if (!featuredImg) return res.status(400).json({ success: false, message: "Featured image is required" });
        if (!title || title.trim().length < 3) return res.status(400).json({ success: false, message: "Title is required (min 3 characters)" });
        if (!shopCategory) return res.status(400).json({ success: false, message: "Category is required" });
        if (!brand || brand.trim().length < 2) return res.status(400).json({ success: false, message: "Brand name must be at least 2 characters" });
        if (!stock || isNaN(stock) || stock <= 0) return res.status(400).json({ success: false, message: "Stock must be a positive number" });
        if (!price || isNaN(price) || price <= 0) return res.status(400).json({ success: false, message: "Price must be a positive number" });
        if (!description || description.trim().length < 10) return res.status(400).json({ success: false, message: "Description must be at least 10 characters" });
        if (!Array.isArray(galleryImg)) return res.status(400).json({ success: false, message: "Gallery images must be an array" });

        const newProduct = await shopProductModel.create({
            title,
            featuredImg,
            shopCategory,
            brand,
            stock,
            price,
            description,
            galleryImg,
            content
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `API error: ${error.message}`
        });
    }
};


export const getShopProductController = async (req, res) => {
    try {
        const data = await shopProductModel.find();
        if (!data) {
            return res.status(400).json({
                success: false,
                message: `Products not found`
            })
        }
        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

