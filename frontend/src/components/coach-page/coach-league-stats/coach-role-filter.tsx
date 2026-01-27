import React from 'react';

type CoachRoleFilterProps = {
	setCoachRole: (role: 'total' | 'allTime' | 'headCoach' | 'assistantCoach') => void;
	coachRole: 'total' | 'allTime' | 'headCoach' | 'assistantCoach';
};

const CoachRoleFilter: React.FC<CoachRoleFilterProps> = ({ coachRole, setCoachRole }) => {
	return (
		<div>
			<p className="font-semibold mb-1">Coach Role</p>
			<fieldset className="flex flex-row gap-4 font-abel">
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="total"
						checked={coachRole === 'total'}
						onChange={() => setCoachRole('total')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Total
				</label>
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="headCoach"
						checked={coachRole === 'headCoach'}
						onChange={() => setCoachRole('headCoach')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Head
				</label>
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="assistantCoach"
						checked={coachRole === 'assistantCoach'}
						onChange={() => setCoachRole('assistantCoach')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Assistant
				</label>
			</fieldset>
		</div>
	);
};

export default CoachRoleFilter;
