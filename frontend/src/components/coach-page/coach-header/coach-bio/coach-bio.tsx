import React from 'react';
import Flag from 'react-world-flags';

import { CoachDetailsResponse } from '@/types/api/coach';
import { calculateAge } from '@/utils/calculateAge';

type CoachBio = {
	coach: CoachDetailsResponse;
};

const CoachBio: React.FC<CoachBio> = ({ coach }) => {
	const date = React.useMemo(() => {
		if (!coach.date_of_birth) return null;
		return new Date(coach.date_of_birth).toLocaleString('default', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}, [coach.date_of_birth]);

	const age = React.useMemo(
		() => (coach.date_of_birth ? calculateAge(coach.date_of_birth) : null),
		[coach.date_of_birth]
	);

	return (
		<div className="h-fit flex flex-col text-white font-mono">
			<div className="border-b border-white border-solid">
				<h2 className="font-bold flex flex-col">
					<span className="text-sm">{coach.first_name}</span>
					<span className="text-4xl uppercase">{coach.last_name}</span>
				</h2>
			</div>
			<div className="h-fit py-4 flex flex-col justify-start gap-2 items-start">
				<dl className="text-sm">
					<div className="flex items-center gap-2">
						<dt className="font-semibold mr-2">Nationality:</dt>
						<dd className="flex items-center gap-2">
							<div className="h-4 aspect-video rounded-xs overflow-hidden">
								<Flag aria-hidden="true" className="object-cover h-full" code={coach.nationality} />
							</div>
							<span className="sr-only">Nationality code:</span>
							<span>{coach.nationality}</span>
						</dd>
					</div>
					{date && (
						<div className="flex items-center gap-2 mt-2">
							<dt className="font-semibold">Age:</dt>
							<dd>
								{age} <span className="uppercase">({date})</span>
							</dd>
						</div>
					)}
				</dl>
			</div>
		</div>
	);
};

export default React.memo(CoachBio);
