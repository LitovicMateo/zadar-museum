import React from 'react';

type CoachRoleFilterProps = {
	setCoachRole: (role: 'total' | 'allTime' | 'headCoach' | 'assistantCoach') => void;
	coachRole: 'total' | 'allTime' | 'headCoach' | 'assistantCoach';
};

const CoachRoleFilter: React.FC<CoachRoleFilterProps> = ({ coachRole, setCoachRole }) => {
	const id = React.useId();

	return (
		<div>
			<p className="font-semibold mb-1">Coach Role</p>
			<fieldset aria-label="Coach role" className="flex flex-row gap-4 font-abel">
				<legend className="sr-only">Coach role</legend>
				<label htmlFor={`${id}-total`} className="flex gap-2">
					<input
						id={`${id}-total`}
						type="radio"
						name={`coach-role-${id}`}
						value="total"
						checked={coachRole === 'total'}
						onChange={() => setCoachRole('total')}
					/>
					Total
				</label>
				<label htmlFor={`${id}-head`} className="flex gap-2">
					<input
						id={`${id}-head`}
						type="radio"
						name={`coach-role-${id}`}
						value="headCoach"
						checked={coachRole === 'headCoach'}
						onChange={() => setCoachRole('headCoach')}
					/>
					Head
				</label>
				<label htmlFor={`${id}-assistant`} className="flex gap-2">
					<input
						id={`${id}-assistant`}
						type="radio"
						name={`coach-role-${id}`}
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

export default React.memo(CoachRoleFilter);
