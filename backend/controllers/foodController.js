const asyncHandler = require('express-async-handler');
const Food = require('../models/Food');

const getFoods = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.available !== undefined) filter.available = req.query.available === 'true';
  const foods = await Food.find(filter).populate('category', 'name').sort({ createdAt: -1 });
  res.json(foods);
});

const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('category', 'name');
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  res.json(food);
});

const createFood = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, available } = req.body;
  if (!name || !price || !category) {
    res.status(400);
    throw new Error('Name, price, and category are required');
  }
  const food = await Food.create({ name, description, price, image, category, available });
  const populated = await food.populate('category', 'name');
  res.status(201).json(populated);
});

const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  const { name, description, price, image, category, available } = req.body;
  food.name = name || food.name;
  food.description = description !== undefined ? description : food.description;
  food.price = price !== undefined ? price : food.price;
  food.image = image !== undefined ? image : food.image;
  food.category = category || food.category;
  food.available = available !== undefined ? available : food.available;
  const updated = await food.save();
  await updated.populate('category', 'name');
  res.json(updated);
});

const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error('Food item not found');
  }
  await food.deleteOne();
  res.json({ message: 'Food item removed' });
});

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
