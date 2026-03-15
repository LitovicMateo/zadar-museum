import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(ts|tsx)'],

	addons: ['@storybook/addon-a11y'],

	framework: {
		name: '@storybook/react-vite',
		options: {}
	},

	viteFinal(config) {
		// Ensure the Tailwind v4 Vite plugin is included (uses @tailwindcss/vite,
		// not PostCSS — must be added manually to the Storybook Vite config).
		config.plugins = config.plugins ?? [];
		config.plugins.push(tailwindcss());

		// Mirror the @ → src alias from vite.config.ts so all imports resolve.
		config.resolve = config.resolve ?? {};
		config.resolve.alias = [
			...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
			{ find: '@', replacement: resolve(__dirname, '../src') }
		];

		return config;
	}
};

export default config;
