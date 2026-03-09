import React from 'react';

import { AlertTriangle } from 'lucide-react';

type Props = {
	className?: string;
	title?: string;
	message?: React.ReactNode;
};

const EditGameWarning: React.FC<Props> = ({
	className = '',
	title = 'Warning — team changes will erase stats',
	message = (
		<>
			Changing the <strong>Home Team</strong> or <strong>Away Team</strong> will
			delete all related player and team statistics. All other fields
			(season, date, stage, round, competition, venue, names, nulled/forfeited,
			neutral) are safe to edit — the data views refresh automatically on every save.
		</>
	)
}) => {
	return (
		<div className={`my-4 ${className}`}>
			<div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md inline-flex max-w-md items-start gap-3">
				<AlertTriangle className="w-6 h-6 shrink-0 text-red-600" />
				<div>
					<div className="font-medium">{title}</div>
					<div className="text-sm">{message}</div>
				</div>
			</div>
		</div>
	);
};

export default EditGameWarning;
