import React from 'react';

type CoachRoleFilterProps = {
	setCoachRole: (role: 'total' | 'headCoach' | 'assistantCoach') => void;
	coachRole: 'total' | 'headCoach' | 'assistantCoach';
};

const CoachRoleFilter: React.FC<CoachRoleFilterProps> = ({ coachRole, setCoachRole }) => {
	return (
		<div>
			<p className="font-semibold mb-1">Coach Role</p>
			<fieldset className="flex flex-row gap-4 font-abel">
				<label className="flex gap-2">
					<input
						type="radio"
						value="total"
						checked={coachRole === 'total'}
						onChange={() => setCoachRole('total')}
					/>
					Total
				</label>
				<label className="flex gap-2">
					<input
						type="radio"
						value="headCoach"
						checked={coachRole === 'headCoach'}
						onChange={() => setCoachRole('headCoach')}
					/>
					Head
				</label>
				<label className="flex gap-2">
					<input
						type="radio"
						value="assistantCoach"
						checked={coachRole === 'assistantCoach'}
						onChange={() => setCoachRole('assistantCoach')}
					/>
					Assistant
				</label>
			</fieldset>
		</div>
	);
};

export default CoachRoleFilter;
