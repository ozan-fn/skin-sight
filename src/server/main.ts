import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());

app.get("/api/hello", async (_, res) => {
    const t = await prisma.user.findMany();
    res.json(t);
});

app.listen(3001, () => console.log("http://localhost:3001"));
