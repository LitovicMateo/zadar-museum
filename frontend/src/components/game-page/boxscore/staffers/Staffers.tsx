import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { Users } from 'lucide-react';

import styles from './Staffers.module.css';

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
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.iconWrap}>
					<Users size={18} className="text-white" />
				</div>
				<h3 className={styles.title}>Team Staff</h3>
			</div>

			<div className={styles.body}>
				{Object.entries(staffersByRole).map(([role, staffers]) => (
					<div key={role} className={styles.roleGroup}>
						<span className={styles.roleLabel}>{role}:</span>
						<div className={styles.staffList}>
							{staffers.map((staffer, index) => (
								<span key={staffer.id} className={styles.staffName}>
									<Link to={`/staff/${staffer.documentId}`} className={styles.staffLink}>
										{staffer.first_name} {staffer.last_name}
										{index < staffers.length - 1 && ','}
									</Link>
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
