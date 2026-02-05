import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React core together
            if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')) {
              return 'vendor-core';
            }
            // Group UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Group icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Group heavy libraries
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('@supabase')) {
              return 'vendor-db';
            }
            // Everything else in a general vendor chunk
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
}));
