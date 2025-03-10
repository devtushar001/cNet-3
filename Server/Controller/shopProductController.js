import shopProductModel from "../Models/shopProductModel.js";
import userModel from "../Models/userModel.js";

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
        let page = parseInt(req.query.page) || 1;
        let limit = 9;
        let skip = (page - 1) * limit;

        const data = await shopProductModel.find().skip(skip).limit(limit);

        const totalProducts = await shopProductModel.countDocuments();

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for this page",
            });
        }

        return res.status(200).json({
            success: true,
            count: data.length,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
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


export const getSingleShopProductController = async (req, res) => {
    try {
        const { shopId } = req.query;
        console.log(shopId)
        if (!shopId) {
            return res.status(400).json({ error: "shopId is required" });
        }

        const product = await shopProductModel.findOne({ _id: shopId });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteShopProductController = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: productId is required."
            });
        }

        const deleteProduct = await shopProductModel.findByIdAndDelete(productId);  // Pass only the ID

        if (!deleteProduct) {
            return res.status(404).json({  // 404 if product doesn't exist
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `API error: ${error.name} - ${error.message}`
        });
    }
};
