import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && {
      ...componentTagger(),
      apply: 'serve',
      enforce: 'post',
      transform(code) {
        // Skip transformation of React.Fragment elements
        // This prevents adding data attributes to fragments
        if (code.includes('React.Fragment') || code.includes('<>')) {
          return null;
        }
        return undefined;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
