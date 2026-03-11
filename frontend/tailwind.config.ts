import type { Config } from 'tailwindcss';

const config: Config = {
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
				mono: ['"DM Mono"', '"Courier New"', 'monospace']
			}
		}
	},
	plugins: []
};
export default config;
