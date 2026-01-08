import React from 'react';
import { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AuthContext } from '@/context/auth-context';
import { AuthProvider } from '@/providers/auth-provider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock apiClient before importing the provider so the module uses the mock
const mockedPost = vi.fn();
const mockedSetLocalAccessToken = vi.fn();
vi.mock('@/services/apiClient', () => ({
	default: {
		post: mockedPost,
		setLocalAccessToken: mockedSetLocalAccessToken
	}
}));

function TestConsumer() {
	const ctx = useContext(AuthContext);
	return (
		<div>
			<div data-testid="user">{ctx.user ? (ctx.user as any).email : 'no-user'}</div>
			<button onClick={() => ctx.login('me', 'pw')}>login</button>
			<button onClick={() => ctx.logout()}>logout</button>
		</div>
	);
}

describe('AuthProvider', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		mockedPost.mockReset();
		mockedSetLocalAccessToken.mockReset();

		(global as any).localStorage = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn()
		};
	});

	it('login stores tokens and user and respects refreshToken', async () => {
		const fakeUser = { id: 1, email: 'me@example.com' };
		mockedPost.mockResolvedValue({
			status: 200,
			data: { jwt: 'jwt-token', user: fakeUser, refreshToken: 'refresh-123' }
		});

		render(
			<MemoryRouter>
				<AuthProvider>
					<TestConsumer />
				</AuthProvider>
			</MemoryRouter>
		);

		userEvent.click(screen.getByText('login'));

		await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('me@example.com'));

		expect(mockedSetLocalAccessToken).toHaveBeenCalledWith('jwt-token');
		expect((global as any).localStorage.setItem).toHaveBeenCalledWith(
			'user',
			JSON.stringify({ id: 1, email: 'me@example.com' })
		);
		expect((global as any).localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-123');
	});

	it('logout clears tokens and storage', async () => {
		// Simulate already logged in user by setting context via rendering provider and then clicking logout
		mockedPost.mockResolvedValue({ status: 200, data: { jwt: 'jwt-token', user: { id: 2, email: 'x@x' } } });

		render(
			<MemoryRouter>
				<AuthProvider>
					<TestConsumer />
				</AuthProvider>
			</MemoryRouter>
		);

		// perform login first so logout does something
		userEvent.click(screen.getByText('login'));
		await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('x@x'));

		userEvent.click(screen.getByText('logout'));

		await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('no-user'));

		expect(mockedSetLocalAccessToken).toHaveBeenCalledWith(null);
		expect((global as any).localStorage.removeItem).toHaveBeenCalledWith('user');
		expect((global as any).localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
	});
});
