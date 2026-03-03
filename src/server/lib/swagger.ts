import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Skin Sight API Documentation",
            version: "1.0.0",
            description: "API documentation for the Skin Sight health application",
        },
        servers: [
            {
                url: "/",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/server/routes/*.ts", "./src/server/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
