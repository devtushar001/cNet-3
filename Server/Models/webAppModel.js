import mongoose from "mongoose";

const webAppSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // Removes leading/trailing spaces
        },
        image: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const WebAppModel = mongoose.models.WebApp || mongoose.model("WebApp", webAppSchema);

export default WebAppModel;
