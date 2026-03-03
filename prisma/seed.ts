import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            name: "example",
            email: "test@example.com",
            password: bcrypt.hashSync("password", 10),
            avatar: "https://i.ibb.co.com/nM0wnWd9/Sakayori-Iroha.jpg",
            role: "ADMIN",
            free: 999,
        },
    });
}

main();
