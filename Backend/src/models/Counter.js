const { mongoose } = require('../config/database');

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
  },
  { versionKey: false, collection: 'counters' }
);

module.exports = mongoose.models.Counter || mongoose.model('Counter', counterSchema);
