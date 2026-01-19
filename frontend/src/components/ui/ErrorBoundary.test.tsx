import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
	throw new Error('Test error');
};

// Component that works fine
const NoError = () => <div>No error</div>;

describe('ErrorBoundary', () => {
	it('should render children when there is no error', () => {
		render(
			<ErrorBoundary>
				<NoError />
			</ErrorBoundary>
		);

		expect(screen.getByText('No error')).toBeInTheDocument();
	});

	it('should render error UI when child throws error', () => {
		// Suppress console.error for this test
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowError />
			</ErrorBoundary>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();

		consoleSpy.mockRestore();
	});

	it('should have a reload button when error occurs', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowError />
			</ErrorBoundary>
		);

		const reloadButton = screen.getByRole('button', { name: /reload/i });
		expect(reloadButton).toBeInTheDocument();

		consoleSpy.mockRestore();
	});
});
