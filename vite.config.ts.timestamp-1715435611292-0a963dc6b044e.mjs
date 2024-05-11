// vite.config.ts
import react from "file:///D:/Projects/origami/node_modules/@vitejs/plugin-react/dist/index.mjs";
import million from "file:///D:/Projects/origami/node_modules/million/dist/packages/compiler.mjs";
import { visualizer } from "file:///D:/Projects/origami/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig, splitVendorChunkPlugin } from "file:///D:/Projects/origami/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///D:/Projects/origami/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(() => ({
  plugins: [
    react(),
    tsconfigPaths(),
    million.vite({ auto: true, log: false }),
    visualizer(),
    splitVendorChunkPlugin()
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        copy: "./copy.html"
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxvcmlnYW1pXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxvcmlnYW1pXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9vcmlnYW1pL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IG1pbGxpb24gZnJvbSBcIm1pbGxpb24vY29tcGlsZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiAoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgbWlsbGlvbi52aXRlKHsgYXV0bzogdHJ1ZSwgbG9nOiBmYWxzZSB9KSxcbiAgICB2aXN1YWxpemVyKCksXG4gICAgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpXG4gIF0sXG5cbiAgLy8gVml0ZSBvcHRpb25zIHRhaWxvcmVkIGZvciBUYXVyaSBkZXZlbG9wbWVudCBhbmQgb25seSBhcHBsaWVkIGluIGB0YXVyaSBkZXZgIG9yIGB0YXVyaSBidWlsZGBcbiAgLy9cbiAgLy8gMS4gcHJldmVudCB2aXRlIGZyb20gb2JzY3VyaW5nIHJ1c3QgZXJyb3JzXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgLy8gMi4gdGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMTQyMCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIHdhdGNoOiB7XG4gICAgICAvLyAzLiB0ZWxsIHZpdGUgdG8gaWdub3JlIHdhdGNoaW5nIGBzcmMtdGF1cmlgXG4gICAgICBpZ25vcmVkOiBbXCIqKi9zcmMtdGF1cmkvKipcIl1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogXCIuL2luZGV4Lmh0bWxcIixcbiAgICAgICAgY29weTogXCIuL2NvcHkuaHRtbFwiXG4gICAgICB9XG4gICAgfVxuICB9XG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlQLE9BQU8sV0FBVztBQUNuUSxPQUFPLGFBQWE7QUFDcEIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxjQUFjLDhCQUE4QjtBQUNyRCxPQUFPLG1CQUFtQjtBQUcxQixJQUFPLHNCQUFRLGFBQWEsT0FBTztBQUFBLEVBQ2pDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLFFBQVEsS0FBSyxFQUFFLE1BQU0sTUFBTSxLQUFLLE1BQU0sQ0FBQztBQUFBLElBQ3ZDLFdBQVc7QUFBQSxJQUNYLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxhQUFhO0FBQUE7QUFBQSxFQUViLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQTtBQUFBLE1BRUwsU0FBUyxDQUFDLGlCQUFpQjtBQUFBLElBQzdCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
