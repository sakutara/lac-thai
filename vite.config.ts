import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Nhà hàng Lạc Thái | Vị Thái chuẩn cho người sành',
        short_name: 'Lạc Thái',
        description:
          'Nhà hàng chuyên phục vụ các món ăn Thái Lan. Không gian sang trọng và đẳng cấp. Hotline: 0906 67 82 83',
        theme_color: '#0B1F17',
        background_color: '#07140F',
        display: 'standalone',
        start_url: '/',
        lang: 'vi',
        icons: [
          {
            src: 'https://lacthai.vn/www/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'https://lacthai.vn/www/images/logo2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/lacthai\.vn\/www\/(uploads|images)\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lacthai-media-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/test-setup.ts',
        'src/main.tsx',
        'src/domain/models/**',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
