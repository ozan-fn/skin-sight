import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth.routes";
import diseaseRoutes from "./routes/disease.routes";
import drugRoutes from "./routes/drug.routes";
import userRoutes from "./routes/user.routes";
import uploadRoutes from "./routes/upload.routes";
import statsRoutes from "./routes/stats.routes";
import { swaggerSpec } from "./lib/swagger";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Swagger JSON Documentation
app.get("/api/docs-json", (req, res) => {
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
