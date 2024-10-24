const mongoose = require('mongoose');
const { Schema } = mongoose;

const glazeSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the glaze
    firing_kiln_type: { type: String, enum: ['electric', 'gas'], default: 'electric' }  // Kiln type for firing (e.g., electric, gas, etc.)
});

// Helper function to generate an id based on the current date and time
const generateId = () => {
    return new Date().toISOString().replace(/[-:.TZ]/g, '');
};

const potterySchema = new Schema({
    id: {
        type: String,
        default: generateId,  // Auto-generate the ID using the helper function
        unique: true,
        required: true,
    },
    name: {
        type: String,
        default: function() {
            return this.id;  // Default to id if no name is provided
        },
        required: true,
    },
    status: {
        type: String,
        enum: ['greenware', 'bisque', 'glazed', 'fired'],  // Define the allowed statuses
        default: 'greenware',
        required: true,
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['greenware', 'bisque', 'glazed', 'fired'],  // Allowed statuses
            },
            timestamp: {
                type: Date,
                default: Date.now,  // Timestamp for when the status was set
            },
        }
    ],
    photos: [
        {
            status: {
                type: String,
                enum: ['greenware', 'bisque', 'glazed', 'fired'],  // Status corresponding to each photo
            },
            photoUrl: {
                type: String,  // Optional field for storing the photo URL
            },
            uploadedAt: {
                type: Date,
                default: Date.now,  // Timestamp for when the photo is uploaded
            },
        },
    ],
    glaze_combo: {
        type: [glazeSchema],
        required: false,
    },
    specialTechniques: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Auto-set the creation timestamp
    },
    updatedAt: {
        type: Date,
        default: Date.now,  // Auto-set the creation timestamp
    },
});

// Automatically update the `updatedAt` field whenever the document is modified
potterySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Pottery = mongoose.model('Pottery', potterySchema);

module.exports = Pottery;
