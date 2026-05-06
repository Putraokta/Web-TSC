import mongoose from "mongoose";

export const CoachSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    birthdate: {
        type: Date,
        required: true
    },

    schools: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
    }],

    
},

    {
        timestamps: true
    });

    CoachSchema.index({ createdAt: 1 });

const CoachModel = mongoose.model("Coach", CoachSchema);

export default CoachModel;