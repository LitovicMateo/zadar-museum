import type { Config } from 'tailwindcss';

const config: Config = {
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
				mono: ['"DM Mono"', '"Courier New"', 'monospace'],
				display: ['Archivo', 'Inter', 'system-ui', 'sans-serif']
			},
			colors: {
				court: 'var(--court)',
				'court-foreground': 'var(--court-foreground)',
				record: 'var(--record)',
				'record-foreground': 'var(--record-foreground)',
				chalk: 'var(--chalk)'
			}
		}
	},
	plugins: []
};
export default config;
