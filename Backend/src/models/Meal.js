const { mongoose } = require('../config/database');

const mealSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true, default: 0 },
    proteins: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false, collection: 'meals' }
);

module.exports = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
