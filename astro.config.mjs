// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
    },
  },
});
