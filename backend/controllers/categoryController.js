const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }
  const category = await Category.create({ name, description, image });
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const { name, description, image } = req.body;
  category.name = name || category.name;
  category.description = description !== undefined ? description : category.description;
  category.image = image !== undefined ? image : category.image;
  const updated = await category.save();
  res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ message: 'Category removed' });
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
