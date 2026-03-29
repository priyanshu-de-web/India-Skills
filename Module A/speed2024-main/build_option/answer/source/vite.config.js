import {defineConfig} from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            "@": "./src",
        }
    },
    base: "/web-stp/build_option/app",
    build: {
        outDir: "../app",
        rollupOptions: {
            input: {
                page1: "page1.html",
                page2: "page2.html",
            },
        }
    }
})