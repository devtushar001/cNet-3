import HireMeModel from "../Models/hireMe.js";

export const hireMeController = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newContact = await HireMeModel.create({ name, email, message });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newContact
        });

    } catch (error) {
        console.error("Error in hireMeController:", error); // Debugging log (optional)
        return res.status(500).json({
            success: false,
            message: `API Error: ${error.message}`
        });
    }
};
