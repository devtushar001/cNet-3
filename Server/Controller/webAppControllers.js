import WebAppModel from "../Models/webAppModel.js";

export const createWebAppController = async (req, res) => {
    try {
        const { name, image, link } = req.body;

        if (!name || !image || !link) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newWebApp = new WebAppModel({ name, image, link });
        await newWebApp.save();

        return res.status(201).json({ success: true, message: "WebApp created successfully.", webApp: newWebApp });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

export const getAllWebAppsController = async (req, res) => {
    try {
        const webApps = await WebAppModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, webApps });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

export const getWebAppByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const webApp = await WebAppModel.findById(id);
        if (!webApp) {
            return res.status(404).json({ success: false, message: "WebApp not found." });
        }
        return res.status(200).json({ success: true, webApp });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};

export const deleteWebAppController = async (req, res) => {
    try {
        const { appId } = req.body;
        const deletedWebApp = await WebAppModel.findByIdAndDelete(appId);
        if (!deletedWebApp) {
            return res.status(404).json({ success: false, message: "WebApp not found or already deleted." });
        }
        return res.status(200).json({ success: true, message: "WebApp deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Error: ${error.message}` });
    }
};
