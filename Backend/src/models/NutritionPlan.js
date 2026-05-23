const { mongoose } = require('../config/database');

const nutritionPlanSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false, collection: 'nutrition_plans' }
);

module.exports =
  mongoose.models.NutritionPlan ||
  mongoose.model('NutritionPlan', nutritionPlanSchema);
