import {defineConfig} from "vite";
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import globalComponents from "./vite-plugin-global-components.ts";
import {fileURLToPath, URL} from "node:url";
import * as path from "path";

export default defineConfig(({mode}) => {
  return {
    root: process.cwd(),
    plugins: [
      vue(),
      vueJsx(),
      globalComponents({
        mode: mode,
        libraryName: '@element-mage-plus/icons',
        output: 'src/components.d.ts',
        prefix: 'Mag'
      }),
      dts({
        rollupTypes: true,
        entryRoot: "src",
        outDir: "dist/dist/types",
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/**/__tests__/**'],
        staticImport: true,
        insertTypesEntry: true,
        cleanVueFileName: true,
        copyDtsFiles: true,
        compilerOptions: {
          declarationMap: false
        }
      })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Prevent duplicate warnings of Sass
          api: 'modern-compiler'
        }
      }
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'ElementMagePlusIcons',
        formats: ['es', 'umd'],
        fileName: (format) => `dist/index.${format}.js`,
        cssFileName: 'index'
      },
      rolldownOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
            'element-plus': 'ElementPlus',
          },
          entryFileNames: 'dist/index.es.js',
          assetFileNames: 'dist/index.css'
        }
      },
      sourcemap: false,
      emptyOutDir: true
    },
    /* 服务代理 */
    server: {
      host: '0.0.0.0',
      port: 8001,
      cors: true,
      hmr: true,
      proxy: {
        '/api': {
          target: 'http://localhost:18080/platform/',
          changeOrigin: true
        }
      }
    }
  }
})
