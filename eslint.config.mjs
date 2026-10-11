import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  // Sans motif explicite, ESLint 9 ignore les .jsx : la quasi-totalite des composants n'etait pas analysee.
  { files: ["**/*.{js,jsx,mjs}"] },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/vendor/**",
      "coverage/**",
    ],
  },
];

export default eslintConfig;
