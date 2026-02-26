import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { Users } from 'lucide-react';

type StaffersProps = {
	teamSlug: string;
};

type Staffer = {
	id: number;
	first_name: string;
	last_name: string;
	role: string;
};

const Staffers: React.FC<StaffersProps> = ({ teamSlug }) => {
	const { gameId } = useParams();
	const { data: game } = useGameDetails(gameId!);

	if (!game || !game.staffers || game.staffers.length === 0) return null;

	// Only show staffers for KK Zadar
	const isZadar = teamSlug === 'kk-zadar';
	if (!isZadar) return null;

	// Group staffers by role
	const staffersByRole = game.staffers.reduce(
		(acc, staffer: Staffer) => {
			const role = staffer.role;
			if (!acc[role]) {
				acc[role] = [];
			}
			acc[role].push(staffer);
			return acc;
		},
		{} as Record<string, Staffer[]>
	);

	return (
		<div className="mt-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg px-4 py-3 border-2 border-blue-200 shadow-sm">
			<div className="flex items-center gap-2 mb-3">
				<div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-lg">
					<Users size={18} className="text-white" />
				</div>
				<h3 className="text-lg font-semibold text-gray-800">Team Staff</h3>
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-2">
				{Object.entries(staffersByRole).map(([role, staffers]) => (
					<div key={role} className="flex items-center gap-2">
						<span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{role}:</span>
						<div className="flex flex-wrap gap-2">
							{staffers.map((staffer, index) => (
								<span key={staffer.id} className="text-sm text-gray-800">
									{staffer.first_name} {staffer.last_name}
									{index < staffers.length - 1 && ','}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Staffers;
