import { defineConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "path";

const ReactCompilerConfig = {
    target: "19",
};

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    plugins: [
        pluginReact(),
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
            babelLoaderOptions(opts) {
                opts.plugins?.unshift(["babel-plugin-react-compiler", ReactCompilerConfig]);
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:3001",
            "/docs": "http://localhost:3001",
        },
    },
    tools: {
        rspack: {
            watchOptions: {
                ignored: ["**/src/server/**", "**/prisma/**"],
            },
        },
    },
});
