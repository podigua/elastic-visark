import {defineConfig} from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
// import OptimizationPersist from 'vite-plugin-optimize-persist'
// import PkgConfig from 'vite-plugin-package-config'
// https://vitejs.dev/config/
import {resolve} from "path";

/** 路径查找 */
const pathResolve = (dir: string): string => {
    return resolve(__dirname, ".", dir);
};
export default defineConfig({
    resolve: {
        alias: [
            {find: '@', replacement: pathResolve("src")},
            {find: '@build', replacement: pathResolve("build")},
        ]
    },
    plugins: [
        vue(),
        // PkgConfig(),
        // OptimizationPersist(),
        electron([
            {
                entry: 'electron/main.ts',
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    options.reload()
                },
            },
        ]),
        renderer(),
    ],
})
