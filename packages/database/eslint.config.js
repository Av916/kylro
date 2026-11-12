import { config } from "@kylro/eslint-config/base";

export default [
    ...config,
    { ignores: ["drizzle/**"] },
];
