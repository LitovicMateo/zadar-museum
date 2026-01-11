import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, AuthContextType, StrapiAuthResponse, StrapiUser } from '@/context/auth-context';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	console.debug('[AuthProvider] mount');
	const [user, setUser] = useState<StrapiUser | null>(null);
	const [jwt, setJwt] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const root = import.meta.env.VITE_API_ROOT || 'https://ovdjejekosarkasve.com/api';
	const path = root + '/auth/local';

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
			const res = await axios.post<StrapiAuthResponse>(path, {
				identifier,
				password
			});

			const data = res.data;

			setJwt(data.jwt);
			setUser(data.user);

			localStorage.setItem('jwt', data.jwt);
			localStorage.setItem('user', JSON.stringify(data.user));

			navigate('/'); // ✅ redirect on success
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
