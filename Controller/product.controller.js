const Product = require("../models/product.models");
const { validationResult } = require('express-validator');
const moddel = require("../models/user-models");
const Order = require("../models/Order.models");
const { v2: cloudinary } = require("cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, description, discount, isNewCollection, stock, category ,rating} = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;
    const product = await Product.create({
      category: category,
      name: name,
      price:price,
      description:description,
      discount: discount,
      isNewCollection: isNewCollection,
      stock: stock,
      image: imageUrl, 
      rating:rating,
    });

    res.status(201).json({ message: "Product created successfully", product });
    console.log(product);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json( {message: products} );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getDiscountProducts = async (req, res) => {
    try {
        const products = await Product.find({ discount: { $gt: 0 } });
        res.status(200).json({ message: "Discount products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getNewCollectionProducts = async (req, res) => {
    try {
        const products = await Product.find({ isNewCollection: true });
        res.status(200).json({ message: "New collection products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 } });
        res.status(200).json({ message: "In-stock products fetched successfully", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.addToCart = async (req, res) => {
   const {productId}=req.body
  const add = await moddel.findById({_id:req.user._id})
 add.cart.push(
  productId
 );
   await add.save();

  res.status(200).json({message:"successfully added to cart"});
};
module.exports.addProduct = async (req, res) => {
  try {
    const user = await moddel.findById(req.user._id).populate("cart");
    const Products = user.cart.map(p => {
      const obj = p.toObject();
      if (p.image && p.image.data) {
        obj.image = `data:${p.image.contentType};base64,${p.image.data.toString('base64')}`;
      }
      return obj;
    }); 

    res.status(200).json({ products:Products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }};
module.exports.likeproductfind = async (req,res)=>{
   const {productId}=req.body
   const user = await moddel.findById({ _id: req.user._id })
   user.like.push(productId);
   await user.save();
   res.status(200).json({ message: "Product liked successfully" });
}
module.exports.likeproductfindget = async (req,res)=>{
  try {
    const user = await moddel.findById(req.user._id).populate("like");
    res.status(200).json({ message: user.like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, paymentMethod, price,discount } = req.body;
    const userId = req.user.id
    if (!productId || !price || !quantity ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const order = new Order({
      user: userId,
      products: [
        {
          product: productId,
          quantity,
          price,
        },
      ],
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice: (price)-(discount*price / 100),
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};
module.exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate("products.product");
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};
