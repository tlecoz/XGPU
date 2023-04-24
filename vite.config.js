// vite.config.js
import { defineConfig } from 'vite'




export default defineConfig({


    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: 'index.ts',
            name: 'xGPU',
            // the proper extensions will be added
            fileName: 'XGPU',
        },


        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['gl-matrix'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    glMatrix: 'glMatrix',
                },
            },
        },

    },
})