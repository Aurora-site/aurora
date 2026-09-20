// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://polarlights.pro",
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "ru",
        locales: {
          ru: "ru-RU",
          en: "en-US",
          cn: "zh-CN",
        },
      },
      filter: (page) =>
        !page.includes("/widgets/") &&
        !/^https:\/\/polarlights\.pro\/ru\//.test(page),
    }),
  ],
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
