

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String},
  description: { type: String },
  stock: { type: Number, required: true },
  isFeatured: {type: Boolean, default: false}
});

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;