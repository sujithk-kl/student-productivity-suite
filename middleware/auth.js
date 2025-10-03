const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

	if (!token) return res.status(401).json({ message: "No token, authorization denied" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Token is not valid" });
	}
};



