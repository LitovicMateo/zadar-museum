import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, AuthContextType, StrapiAuthResponse, StrapiUser } from '@/context/auth-context';
import apiClient from '@/services/apiClient';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	console.debug('[AuthProvider] mount');
	const [user, setUser] = useState<StrapiUser | null>(null);
	const [jwt, setJwt] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		const storedJwt = localStorage.getItem('jwt');
		const storedUser = localStorage.getItem('user');

		if (storedJwt && storedUser) {
			setJwt(storedJwt);
			setUser(JSON.parse(storedUser));
		}

		setLoading(false);
	}, []);

	const login = async (identifier: string, password: string) => {
		try {
			const res = await apiClient.post<StrapiAuthResponse>('/api/auth/local', {
				identifier,
				password
			});

			if (!res || res.status < 200 || res.status >= 300) {
				throw new Error('Login failed');
			}

			const data = res.data as StrapiAuthResponse;

			setJwt(data.jwt);
			setUser(data.user);

			// persist tokens + user
			await apiClient.setLocalAccessToken(data.jwt);
			localStorage.setItem('user', JSON.stringify(data.user));

			navigate('/');
			return data.user;
		} catch (error) {
			// Log the underlying error for diagnostics and throw a normalized message
			// (do not leak sensitive internals to callers)
			console.debug('[AuthProvider] login error', error);
			throw new Error('Invalid credentials');
		}
	};

	const logout = () => {
		setJwt(null);
		setUser(null);
		localStorage.removeItem('jwt');
		localStorage.removeItem('user');
	};

	const value: AuthContextType = {
		user,
		jwt,
		loading,
		isAuthenticated: !!user,
		login,
		logout
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
