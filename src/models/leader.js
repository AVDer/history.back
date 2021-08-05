// Require the mongoose library
import mongoose from 'mongoose';

// Define the leader's database schema
const leaderSchema = new mongoose.Schema(
    {
        nameLatin: {
            type: String,
            required: true
        },
        nameOriginal: {
            type: String,
            required: false
        },
        land: {
            type: [String],
            required: false
        },
        start: {
            y: Number,
            m: Number,
            d: Number
        },
        end: {
            y: Number,
            m: Number,
            d: Number
        },
        url: {
            type: String,
            required: false
        }
    },
    {
        // Assigns createdAt and updatedAt fields with a Date type
        timestamps: true
    }
);

// Export the the 'Leader' model with the schema
export default mongoose.model('Leader', leaderSchema);