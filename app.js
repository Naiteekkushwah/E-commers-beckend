const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./db/db-conect');
const router = require('./Routers/router-controller');
const ownerRouter = require('./Routers/router-owner');
const productRouter = require('./Routers/router-products');
connectDB();
const multer  = require('multer')

const cookie = require('cookie-parser');
app.use(cookie())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
 origin: "https://e-commers-fernted.vercel.app/",
  credentials: true
}));

app.use('/api',router)
app.use('/api',ownerRouter)
app.use('/api', productRouter);

module.exports = app;




module.exports = app;


