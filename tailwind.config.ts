import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        field: {
          ink: "#1f2933",
          moss: "#566246",
          grass: "#6f8f52",
          straw: "#d6b36a",
          clay: "#ad6b4f",
          mist: "#eef3ed"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
