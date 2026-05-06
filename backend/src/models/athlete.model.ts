import mongoose from "mongoose";
import { BELT } from "../utils/contants";

export const AtlheteSchema = new mongoose.Schema({
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

    imageUrl: {
        type: String,
        default: ""
    },

    belt: {
        type: String,
        default: null,
        enum: [BELT.PUTIH, BELT.KUNING, BELT.HIJAU, BELT.BIRU, BELT.COKLAT, BELT.HITAM],
        required: true
    }


},

    {
        timestamps: true
    });

const AthleteModel = mongoose.model("Athlete", AtlheteSchema);

export default AthleteModel;