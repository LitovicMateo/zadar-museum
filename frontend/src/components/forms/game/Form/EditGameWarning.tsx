import React from 'react';

import { AlertTriangle } from 'lucide-react';

type Props = {
	className?: string;
	title?: string;
	message?: string;
};

const EditGameWarning: React.FC<Props> = ({
	className = '',
	title = 'Warning — editing will erase stats',
	message = 'Editing this game will delete all related player and team statistics. Please ensure you have a backup or are certain before continuing.'
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
