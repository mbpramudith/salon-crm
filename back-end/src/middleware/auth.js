const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const config = require("../config/server");

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
	try {
		const apiKey = req.headers["x-api-key"];
		const token = req.headers.authorization?.replace("Bearer ", "");
		// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNjBjM2NiMC1lMjkxLTQ1ODYtODg3YS1hNjFjY2M1YzAyNGIiLCJlbWFpbCI6InN0YWZmQGJlYXV0eXBhcmFkaXNlLmNvbSIsInJvbGUiOiJTVEFGRiIsInNhbG9uSWQiOiJzYW1wbGUtc2Fsb24taWQiLCJpYXQiOjE3NTg2MTkxMTksImV4cCI6MTc1ODcwNTUxOX0.T4IOM_YlsDXnwAlZ_C3OxFO-dkeFQVuDLp0KG05BhQ4";

		// const decoded = jwt.verify(token, config.jwtSecret);
		// console.log("Decoded token:", decoded);

		console.log("apiKey :", apiKey);
		console.log("token :", token);
		console.log("config.jwtSecret :", config.jwtSecret);
		// const decoded = jwt.verify(token, config.jwtSecret);
		// console.log("decoded :", decoded)

		// Check API key first
		if (!apiKey) {
			return res.status(401).json({ error: "API key is required" });
		}

		console.log("apiKey validation : pass");
		// Validate API key
		const user = await prisma.user.findFirst({
			where: {
				apiKey,
				isActive: true,
			},
			include: {
				salon: true,
			},
		});

		console.log("user finder : pass");

		if (!user) {
			return res.status(401).json({ error: "Invalid API key" });
		}

    console.log("user validation : pass");

		// If JWT token is provided, validate it
		if (token) {
			try {
				const decoded = jwt.decode(token);

				console.log("decoded :", decoded);
				console.log("user.id :", user.id);

				// Ensure the token user matches the API key user
				// if (decoded.userId !== user.id) {
				//   return res.status(401).json({ error: 'Token and API key mismatch' });
				// }

				req.user = { ...user, ...decoded };
			} catch (jwtError) {
				return res.status(401).json({ error: "Invalid or expired token" });
			}
		} else {
			// Use API key user if no JWT token
			req.user = user;
		}

		next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		return res.status(500).json({ error: "Authentication error" });
	}
};

const requireRole = (roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ error: "Authentication required" });
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: "Insufficient permissions" });
		}

		next();
	};
};

const generateToken = (user) => {
	const payload = {
		userId: user.id,
		email: user.email,
		role: user.role,
		salonId: user.salonId ?? "untitledID",
	};
	const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" });

	console.log("Generated token:", token);

	return token;
};

module.exports = {
	authMiddleware,
	requireRole,
	generateToken,
};
