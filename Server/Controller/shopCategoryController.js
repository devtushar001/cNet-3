import shopCategoryModel from "../Models/shopCategoryModel.js";

export const createShopCategoryController = async (req, res) => {

    try {
        const { shopCategoryName,
            shopCategoryImage } = req.body;
        if (!shopCategoryName || !shopCategoryImage) {
            return res.status(404).json({
                success: false,
                message: `All Fields Are Required`
            })
        }

        const createCategory = shopCategoryModel.create({
            shopCategoryName,
            shopCategoryImage
        })

        if (!createCategory) {
            return res.status(500).json({
                success: false,
                message: `Category not created`
            })
        }

        return res.status(200).json({
            success: true,
            message: `Saved success fully`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Api error ${error.message}`
        })
    }
}

export const getShopCategoryController = async (req, res) => {
    try {
        const shopCategories = await shopCategoryModel.find();

        if (!shopCategories || shopCategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Categories not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All categories fetched",
            shopCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `API error: ${error.message}`,
        });
    }
};

export const deleteShopCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required."
            });
        }

        const deleteCategory = await shopCategoryModel.findByIdAndDelete(categoryId);

        if (!deleteCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `API error: ${error.name} - ${error.message}`
        });
    }
};
