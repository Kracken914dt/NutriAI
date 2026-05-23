const { mongoose } = require('../config/database');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, default: null },
    weight: { type: Number, default: null },
    height: { type: Number, default: null },
    gender: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    activity_level: { type: String, default: 'moderado' },
    target_weight: { type: Number, default: null },
    food_preference: { type: String, default: 'ninguna' },
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false, collection: 'users' }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
