const Product = require("../models/product.model");
const Order = require("../models/order.model");

module.exports = {
  get: async (_, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({ products, error: false });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Something went wrong while processing your request",
      });
    }
  },

  buy: async (req, res) => {
    const data = req.body;
    const userId = req.userId;

    if (data.length <= 0) {
      return res.status(400).json({ message: "Cart is empty", error: true });
    }

    const productIds = data.map((item) => item.id);

    try {
      // Create order with the following products
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid request", error: true });
      }

      let orderTotal = 0;

      const orderProductsData = products.map((item) => {
        const i = data.find((el) => el.id === item.id);
        const price = Number(i?.quantity) * Number(item.price);

        orderTotal += price;

        return {
          product: item._id,
          quantity: i?.quantity,
          price: price,
        };
      });

      const orderData = {
        user: userId,
        items: orderProductsData,
        orderTotal,
      };

      await Order.create(orderData);

      return res.json({ message: "Order created", error: false });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: "Something went wrong while processing your request",
        error: true,
      });
    }
  },
};
