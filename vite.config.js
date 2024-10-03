import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import glsl from 'vite-plugin-glsl';
import glslReplaceIncludes from './plugins/replaceIncludes';


// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/anoyo/'
    : '/',
  plugins: [
    vue(),
    glslReplaceIncludes(),
    glsl({
      root: '/src/libs/', // Root directory for importing files
      exclude: undefined, // File paths/extensions to ignore
      include: /\.(glsl|wgsl|vert|frag|vs|fs)$/i, // File paths/extensions to import
      defaultExtension: 'glsl', // Shader suffix when no extension is specified
      warnDuplicatedImports: false, // Warn if the same chunk was imported multiple times
      compress: false, // Compress the resulting shader code
    }),],
  optimizeDeps: {
    include: ['eventemitter3', 'three'],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
