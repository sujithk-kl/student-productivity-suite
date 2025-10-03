const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		password: { type: String, required: true, minlength: 6 },
		university: { type: String },
		major: { type: String },
		year: { type: String },
		phone: { type: String },
		avatarUrl: { type: String },
		roles: { type: [String], default: ["student"] },
		settings: {
			notifications: { type: Boolean, default: true },
			darkMode: { type: Boolean, default: false },
			timezone: { type: String, default: "UTC" }
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);



