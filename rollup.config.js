
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
            file: "dist/index.cjs.js",
            exports: "named",
            sourcemap: true,
        },
        {
            format: "es",
            file: "dist/index.esm.js",
            exports: "named",
            sourcemap: true,
        }
    ]
};