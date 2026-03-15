import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Import global styles so components render with the correct fonts, CSS
// custom properties (design tokens), and Tailwind base/utility classes.
import '../src/index.css';

// Start the MSW service worker. Stories that need API mocking define their
// own `parameters.msw.handlers` array — stories that don't are unaffected.
initialize({
	onUnhandledRequest: 'bypass'
});

const preview: Preview = {
	loaders: [mswLoader],

	decorators: [
		(Story) => {
			// A fresh QueryClient per story prevents cache from leaking between
			// stories while keeping React Query's optimistic rendering intact.
			const queryClient = new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
						staleTime: Infinity
					}
				}
			});

			return (
				<QueryClientProvider client={queryClient}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</QueryClientProvider>
			);
		}
	],

	parameters: {
		// Suppress the "couldn't find any stories" banner for autodocs.
		docs: {
			toc: true
		},
		// Default layout — can be overridden per story with parameters.layout.
		layout: 'centered'
	}
};

export default preview;
