import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
import drugRoutes from "./routes/drug.routes.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { swaggerSpec } from "./lib/swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Swagger JSON Documentation
app.get("/api/docs-json", (_req, res) => {
    res.json(swaggerSpec);
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/drugs", drugRoutes);

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);

app.get("/api/hello", async (_, res) => {
    const t = await prisma.user.findMany();
    res.json(t);
});

app.listen(3001, () => console.log("http://localhost:3001"));
