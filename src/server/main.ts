import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.ts";
import { swaggerSpec } from "./lib/swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Swagger JSON Documentation
app.get("/api/docs-json", (req, res) => {
    res.json(swaggerSpec);
});

// Scalar Documentation (Standalone HTML)
app.get("/docs", (req, res) => {
    res.send(`
<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <script id="api-reference" data-url="/api/docs-json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      // Handshake otomatis untuk mengisi token tanpa localStorage
      async function setupScalar() {
        let accessToken = "";
        try {
          const response = await fetch("/api/auth/refresh", { method: "POST" });
          if (response.ok) {
            const data = await response.json();
            accessToken = data.accessToken;
          }
        } catch (e) {
          console.error("Auth handshake failed", e);
        }

        const configuration = {
          spec: { url: "/api/docs-json" },
          authentication: {
            preferredSecurityScheme: "bearerAuth",
            bearer: { token: accessToken }
          },
          persistConfig: true,
        };

        const el = document.getElementById('api-reference');
        // Gunakan Scalar Global yang dimuat dari CDN
        const reference = document.createElement('div');
        document.body.appendChild(reference);
        
        // Memanggil Scalar API Reference
        ScalarApiReference.init(reference, configuration);
      }
      
      setupScalar();
    </script>
  </body>
</html>
    `);
});

// Auth Routes
app.use("/api/auth", authRoutes);

app.get("/api/hello", async (_, res) => {
    const t = await prisma.user.findMany();
    res.json(t);
});

app.listen(3001, () => console.log("http://localhost:3001"));
