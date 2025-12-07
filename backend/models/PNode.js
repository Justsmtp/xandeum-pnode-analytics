// backend/models/PNode.js
import mongoose from 'mongoose';

const pNodeSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true, index: true },
  gossipStatus: { type: String, enum: ['active', 'gossiping', 'offline', 'unknown'], default: 'unknown' },
  storage: {
    used: Number,
    total: Number,
    available: Number,
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      lat: Number,
      lon: Number,
    },
  },
  uptime: { type: Number, default: 0 },
  version: String,
  lastSeen: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Indexes
pNodeSchema.index({ gossipStatus: 1 });
pNodeSchema.index({ lastSeen: -1 });
pNodeSchema.index({ 'location.region': 1 });

export default mongoose.model('PNode', pNodeSchema)