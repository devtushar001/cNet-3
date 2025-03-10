import mongoose from "mongoose";

const webAppSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        required: true
    }
}, {timestamps: true});

const webAppModel = mongoose.models.WebApps || mongoose.model("WebApps", webAppSchema);

export default webAppModel;