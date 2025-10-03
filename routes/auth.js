const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/register
router.post(
	"/register",
	[
		body("firstName").notEmpty(),
		body("lastName").notEmpty(),
		body("email").isEmail(),
		body("password").isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { firstName, lastName, email, password, university, major, year, phone } = req.body;

		try {
			let existing = await User.findOne({ email });
			if (existing) return res.status(409).json({ message: "Email already registered" });

			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			const user = await User.create({
				firstName,
				lastName,
				email,
				password: hash,
				university,
				major,
				year,
				phone
			});

			const payload = { user: { id: user.id, email: user.email } };
			const token = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });

			return res.status(201).json({
				token,
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					university: user.university,
					major: user.major,
					year: user.year,
					phone: user.phone
				}
			});
		} catch (err) {
			console.error("Register error", err);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

// POST /api/auth/login
router.post(
	"/login",
	[body("email").isEmail(), body("password").notEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });
			if (!user) return res.status(401).json({ message: "Invalid credentials" });

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

			const payload = { user: { id: user.id, email: user.email } };
			const token = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });

			return res.json({
				token,
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				}
			});
		} catch (err) {
			console.error("Login error", err);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

module.exports = router;
