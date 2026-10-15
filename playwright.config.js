import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 40000, workers: 1,
  use: { baseURL: 'http://127.0.0.1:5174', headless: true, trace: 'retain-on-failure' },
  webServer: { command: 'VITE_RESULTS_MODE=demo npm run dev -- --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: true },
});
