import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { svgBuilder } from './src/utils/svgBuilder';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL,
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    svgBuilder('./src/icons/svg/'),
  ],
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 配置全局 scss 变量
        additionalData: `@import "@/styles/index.scss";`
      },
    }
  },
  resolve: {
    alias: {//导入的别名，避免出现大量相对路径，优雅且不易出错
      // 路径映射必须以/开头和结尾。// 使用：import CourseAdd from "comps/CourseAdd.vue";
      "comps": path.resolve(__dirname, "src/components"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    host: '127.1.2.3', //设置开发服务器的域名
    port: '1111', //设置开发服务器的端口号
    open: true,//自动在浏览器中打开应用程序
    proxy: {//浏览器代理
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
