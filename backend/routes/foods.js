const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');

router.route('/').get(getFoods).post(protect, admin, createFood);
router
  .route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

module.exports = router;
