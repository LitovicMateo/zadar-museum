import React from 'react';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error) {
		// eslint-disable-next-line no-console
		console.error('[ErrorBoundary] caught error', error);
		this.setState({ error });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div role="alert" className="p-6 max-w-3xl mx-auto">
					<h2 className="text-xl font-semibold">Something went wrong</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						An unexpected error occurred. Try reloading the page.
					</p>
					<div className="mt-4">
						<button
							className="px-4 py-2 bg-blue-600 text-white rounded"
							onClick={() => window.location.reload()}
						>
							Reload
						</button>
					</div>
				</div>
			);
		}

		return this.props.children as React.ReactElement;
	}
}
