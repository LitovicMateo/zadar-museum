import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext, AuthContextType, StrapiAuthResponse, StrapiUser } from '@/context/auth-context';
import apiClient from '@/lib/api-client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
			const res = await apiClient.post<StrapiAuthResponse>('/auth/local', {
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
			// Throw normalized error message without logging sensitive details
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
