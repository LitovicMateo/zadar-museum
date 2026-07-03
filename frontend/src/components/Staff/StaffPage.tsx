import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorBoundary from '@/components/UI/ErrorBoundary';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';

import StaffHero from './StaffHero/StaffHero';
import StaffContent from './StaffContent/StaffContent';

const StaffPage: React.FC = () => {
	const { staffId } = useParams();
	const navigate = useNavigate();

	const { data: staffDetails, isFetched } = useStaffDetails(staffId!);

	useEffect(() => {
		if (!staffDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [staffDetails, isFetched, navigate]);

	if (!staffDetails) return null;

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<ErrorBoundary>
					<StaffHero />
				</ErrorBoundary>
				<main id="staff-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<ErrorBoundary>
						<StaffContent />
					</ErrorBoundary>
				</main>
			</div>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.staff.edit}${staffId}`} />
		</GamesProvider>
	);
};

export default StaffPage;
