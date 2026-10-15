import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
export default defineConfig(({mode}) => {
 const env = {...loadEnv(mode, process.cwd(), ''), ...process.env};
 return {
  server: {
    proxy: { '/api': { target: `http://127.0.0.1:${env.API_PORT || 3001}`, changeOrigin: false } },
    fs: { deny: ['**/.env', '**/.env.*', '**/.private/**', '**/server/**', '**/*.gs', '**/*.{crt,pem}', '**/.git/**'] },
  },
  build: { rollupOptions: { input: {
    main: resolve('index.html'),
    thanks: resolve('thanks/index.html'),
    rki1: resolve('rki-1/test/index.html'),
    rki2: resolve('rki-2/test/index.html'),
    rki3: resolve('rki-3/test/index.html'),
    rku1: resolve('rku-1/test/index.html'),
    rku2: resolve('rku-2/test/index.html'),
    rku3: resolve('rku-3/test/index.html'),
  }}},
 };
});
