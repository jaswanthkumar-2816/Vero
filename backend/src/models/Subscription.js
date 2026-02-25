const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    recruiterId: { type: String, required: true },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    resumeLimit: { type: Number, default: 50 },
    resumesUsed: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
