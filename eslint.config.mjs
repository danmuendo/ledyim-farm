import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignores = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts"
    ]
  }
];

const eslintConfig = [...ignores, ...nextCoreWebVitals, ...nextTypescript];

export default eslintConfig;
