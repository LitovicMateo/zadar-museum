import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';
import { Users } from 'lucide-react';

type StaffersProps = {
	teamSlug: string;
};

type Staffer = {
	id: number;
	documentId: string;
	first_name: string;
	last_name: string;
	role: string;
};

const Staffers: React.FC<StaffersProps> = ({ teamSlug }) => {
	const { gameId } = useParams();
	const { data: game } = useGameDetails(gameId!);
	const { data: mainTeam } = useMainTeam();

	if (!game || !game.staffers || game.staffers.length === 0) return null;

	// Only show staffers for the main team
	const isMainTeam = teamSlug === mainTeam?.slug;
	if (!isMainTeam) return null;

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
		<div className="rounded-lg border border-border bg-muted/40 px-3 py-3">
			<div className="mb-2 flex items-center gap-2">
				<span className="flex size-6 items-center justify-center rounded-md bg-court text-record">
					<Users size={14} />
				</span>
				<h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
					Team Staff
				</h3>
			</div>

			<div className="flex flex-col gap-1.5">
				{Object.entries(staffersByRole).map(([role, staffers]) => (
					<div key={role} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
						<span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
							{role}:
						</span>
						{staffers.map((staffer, index) => (
							<Link
								key={staffer.id}
								to={`/staff/${staffer.documentId}`}
								className="font-medium text-foreground transition-colors hover:text-record"
							>
								{staffer.first_name} {staffer.last_name}
								{index < staffers.length - 1 && ','}
							</Link>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Staffers;
