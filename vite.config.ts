import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Permite `import { x } from "@/lib/gsap"` em vez de "../../lib/gsap".
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Avisa no console quando um chunk passa de 180 kB (nosso orcamento e 170 kB gzip).
    chunkSizeWarningLimit: 180,
    rollupOptions: {
      output: {
        // Separa GSAP em seu proprio chunk: muda pouco entre deploys, entao o
        // navegador mantem em cache mesmo quando o resto do site e atualizado.
        // O Vite 8 roda sobre Rolldown, onde manualChunks aceita apenas funcao
        // (a forma de objeto foi removida).
        manualChunks(id) {
          if (id.includes("node_modules/gsap") || id.includes("node_modules/@gsap")) {
            return "gsap";
          }
          return null;
        },
      },
    },
  },
});
