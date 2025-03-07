import mongoose from 'mongoose';

const hireMeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const HireMeModel = mongoose.models.HireMe || mongoose.model("HireMe", hireMeSchema);

export default HireMeModel;
