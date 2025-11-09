import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/context/auth-context';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return null; // or spinner
	if (!isAuthenticated) return <Navigate to="/login" replace />;

	return <>{children}</>;
};

export default ProtectedRoute;
