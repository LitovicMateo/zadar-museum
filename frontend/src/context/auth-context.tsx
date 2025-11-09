import { createContext, useContext } from 'react';

// const API_URL = import.meta.env.VITE_STRAPI_URL;

// ---- Types ---- //

export interface StrapiUser {
	id: number;
	username: string;
	email: string;
	confirmed?: boolean;
	blocked?: boolean;
	// Add custom fields from Strapi user model if any
}

export interface StrapiAuthResponse {
	jwt: string;
	user: StrapiUser;
}

export interface AuthContextType {
	user: StrapiUser | null;
	jwt: string | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: (identifier: string, password: string) => Promise<StrapiUser>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
	user: null,
	jwt: null,
	loading: true,
	isAuthenticated: false,
	login: async () => {
		throw new Error('AuthProvider is not mounted');
	},
	logout: () => {}
});

export const useAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext);
	// return context directly; if provider is missing the default above will be used
	return ctx;
};
