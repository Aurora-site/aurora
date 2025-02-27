// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      DEPLOY_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:4321",
      }),
      ENV_NAME: envField.enum({
        context: "client",
        access: "public",
        default: "dev",
        values: ["dev", "main", "test"],
      }),
    },
  },
  i18n: {
    defaultLocale: "ru",
    locales: ["en", "ru", "cn"],
  },
});
