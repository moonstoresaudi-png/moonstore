import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // ما ننشر خرائط المصدر (source maps) بالإنتاج — تصعّب قراءة الكود
    // الأصلي من المتصفح. هذا ليس "تشفير" (كود الواجهة لازم يشتغل بالمتصفح
    // فما فيه تشفير حقيقي ممكن)، بس يمنع القراءة المباشرة والتصحيح السهل.
    sourcemap: false,
    minify: 'esbuild',
  },
});
