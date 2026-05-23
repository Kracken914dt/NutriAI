const { connectDatabase } = require('../config/database');
const Counter = require('./Counter');
const User = require('./User');
const Meal = require('./Meal');
const NutritionPlan = require('./NutritionPlan');

module.exports = {
  connectDatabase,
  Counter,
  User,
  Meal,
  NutritionPlan
};
