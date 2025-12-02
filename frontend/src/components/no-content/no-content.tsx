import React from 'react';

import { Info, CheckCircle, XCircle } from 'lucide-react';

type NoContentType = 'success' | 'error' | 'info';

type Props = {
	type: NoContentType;
	title?: string;
	description?: React.ReactNode;
};

const iconByType = (type: NoContentType) => {
	switch (type) {
		case 'success':
			return <CheckCircle className="w-6 h-6 text-green-500" />;
		case 'error':
			return <XCircle className="w-6 h-6 text-red-600" />;
		case 'info':
		default:
			return <Info className="w-6 h-6 text-blue-500" />;
	}
};

const stylesByType = (type: NoContentType) => {
	switch (type) {
		case 'success':
			return 'bg-green-50 border border-green-100 text-green-800';
		case 'error':
			return 'bg-red-50 border border-red-200 text-red-800';
		case 'info':
		default:
			return 'bg-blue-50 border border-blue-100 text-blue-800';
	}
};

const NoContent: React.FC<Props> = ({ type, title, description }) => {
	if ((title === undefined || title === '') && (description === undefined || description === '')) {
		throw new Error('NoContent requires at least a `title` or a `description`.');
	}

	const icon = iconByType(type);
	const containerStyles = stylesByType(type);

	const alignClass = title ? 'items-start' : 'items-center';

	return (
		<div className="w-full flex justify-center">
			<div
				className={`flex ${alignClass} gap-3 max-w-xl w-full rounded-md py-3 px-4 font-abel ${containerStyles}`}
			>
				<div className={`shrink-0 ${title ? 'mt-0.5' : ''}`}>{icon}</div>
				<div className="text-left text-sm">
					{title ? <div className="font-medium">{title}</div> : null}
					{description ? <div>{description}</div> : null}
				</div>
			</div>
		</div>
	);
};

export default NoContent;
