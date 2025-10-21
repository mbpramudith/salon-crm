require("dotenv").config();
const createApp = require('./app');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

async function startServer() {
	try {
		// Test database connection
		await prisma.$connect();
		console.log("✅ Database connected successfully");

		// Create the Express + Apollo app
		const app = await createApp();

		// Start the server
		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
			console.log(
				`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`
			);
		});
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1);
	}
}

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("🛑 Shutting down server...");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("🛑 Shutting down server...");
	await prisma.$disconnect();
	process.exit(0);
});

startServer();
