
import typescript from "@rollup/plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
    input: 'typescript/index.ts',
    plugins: [
        typescript({
            exclude: "node_modules/**",
            typescript: require("typescript"),
            tsconfig: './tsconfig.json'
        }),
        sourceMaps()
    ],
    output: [
        {
            format: "cjs",
            file: "dist/cjs/index.js",
            exports: "named",
            sourcemap: true,
        },
        {
            format: "es",
            file: "dist/esm/index.js",
            exports: "named",
            sourcemap: true,
        }
    ]
};