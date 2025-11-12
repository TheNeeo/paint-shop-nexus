import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom wrapper for componentTagger to skip React.Fragment elements
const createComponentTaggerPlugin = () => {
  const tagger = componentTagger();

  return {
    ...tagger,
    transform(code, id) {
      // Don't tag files containing only Fragment definitions or critical Fragment usage
      if (code.includes('React.Fragment') && !code.includes('TableRow')) {
        return null;
      }

      // Call the original transform
      return tagger.transform?.call(this, code, id);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    createComponentTaggerPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
