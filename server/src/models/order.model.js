const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for individual items in the order
const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Assuming there's a Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less than 1."],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can not be negative."],
    },
  },
  { _id: false }
); // Set _id to false if you don't want separate _id for each item

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [OrderItemSchema],
  orderTotal: {
    type: Number,
    required: true,
    min: [0, "Order total can not be negative."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Order model
module.exports = mongoose.model("Order", OrderSchema);
