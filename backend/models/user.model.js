const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    subscription: {
        plan: { type: String }, // monthly/yearly
        status: { type: String, default: "inactive" },
        startDate: Date,
        endDate: Date,
        paymentId: String,
    },

    charity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Charity",
    },

    charityPercent: {
        type: Number,
        default: 10,
    }
});

module.exports = mongoose.model("User", userSchema);