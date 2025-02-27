import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRouter from './Router/userRouter.js';
import connectDB from './Config/connectDB.js';
import crudRouter from './Router/crudRouter.js';
import razorPayRouter from './Router/razorPayRouter.js';
import imageRouter from './Router/imageRoutes.js';
import cloudinarySetup from './Config/cloudinarySetup.js';
import textEditorRouter from './Router/textEditorRoutes.js';
import cartRouter from './Router/cartRouter.js';
import shopCategoryRouter from './Router/shopCategoryRouter.js';

dotenv.config();

const port = process.env.PORT;
const mongo_url = process.env.MONGODB_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;


if (!port || !mongo_url) {
  throw new Error("Missing required environment variables: PORT or MONGODB_URL");
}

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));




connectDB(mongo_url);
cloudinarySetup(cloudName, cloudApiKey, cloudApiSecret)

app.use('/api/user', userRouter);
app.use('/api/crud', crudRouter);
app.use('/api/razorpay', razorPayRouter);
app.use('/api/images', imageRouter);
app.use('/api/text-edit', textEditorRouter);
app.use('/api/user-cart', cartRouter);
app.use('/api/shop-category', shopCategoryRouter);
app.use('/api/shop-products', shopCategoryRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Server running on port ${port}`,
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
