import React from 'react';
import Flag from 'react-world-flags';

import { CoachDetailsResponse } from '@/types/api/coach';
import { calculateAge } from '@/utils/calculateAge';

type CoachBio = {
	coach: CoachDetailsResponse;
};

const CoachBio: React.FC<CoachBio> = ({ coach }) => {
	const date =
		!!coach.date_of_birth &&
		new Date(coach.date_of_birth).toLocaleString('default', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});

	const age = coach.date_of_birth ? calculateAge(coach.date_of_birth) : null;
	return (
		<div className="h-fit flex flex-col text-white font-mono">
			<div className="border-b border-white border-solid">
				<h2 className="font-bold flex flex-col">
					<span className="text-sm">{coach.first_name}</span>
					<span className="text-4xl uppercase">{coach.last_name}</span>
				</h2>
			</div>
			<div className="h-fit py-4 flex flex-col justify-start gap-2 items-start">
				<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
					Nationality:
					<div className="h-4 aspect-video rounded-xs overflow-hidden">
						<Flag className="object-cover object- h-full" code={coach.nationality} />
					</div>
				</label>
				{date && (
					<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
						{`Age: ${age}`}
						<span className="uppercase">{`(${date})`}</span>
					</label>
				)}
			</div>
		</div>
	);
};

export default CoachBio;
