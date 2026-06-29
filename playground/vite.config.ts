import {defineConfig} from "vite";
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import {fileURLToPath, URL} from "node:url";
import path from "path";
// import {appProfile} from "./src/config/appConfig.ts";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    // base: appProfile.appBase,
    root: process.cwd(),
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        '@element-mage-plus/components': path.resolve(__dirname, 'packages/components/src'),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Prevent duplicate warnings of Sass
          api: 'modern-compiler'
        }
      }
    },
    /* 服务代理 */
    server: {
      host: '0.0.0.0',
      port: 8000,
      proxy: {
        '/api': {
          target: 'http://localhost:18080/platform/',
          changeOrigin: true
        },
        '/data': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/data/, '')
        }
      },
      cors: true,
      hmr: true
    }
  }
})
