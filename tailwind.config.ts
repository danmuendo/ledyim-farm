import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        field: {
          ink: "#1f2933",
          soil: "#3f3328",
          moss: "#4f6640",
          grass: "#7c985f",
          leaf: "#8ea86b",
          straw: "#d7b46a",
          clay: "#b66f52",
          sky: "#8fb8bd",
          cream: "#fbfaf5",
          mist: "#eef3ed"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(63, 51, 40, 0.08)",
        lift: "0 18px 45px rgba(63, 51, 40, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
