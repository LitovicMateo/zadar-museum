import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwind(), react()],
	resolve: {
		alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://backend:1337',
				changeOrigin: true
			},
			'/admin': {
				target: 'http://backend:1337',
				changeOrigin: true
			}
		}
	}
});
