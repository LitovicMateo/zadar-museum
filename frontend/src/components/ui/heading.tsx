import React from 'react';

type HeadingProps = {
	title: string;
	type?: 'main' | 'secondary';
};

const Heading: React.FC<HeadingProps> = ({ title, type = 'main' }) => {
	return (
		<div className="flex items-center gap-3">
			<div className={`${type === 'main' ? 'w-1 h-8' : 'w-0.5 h-5'} rounded-sm bg-blue-600 shrink-0`} />

			<h2
				className={`${
					type === 'main' ? 'text-2xl font-semibold text-gray-900' : 'text-sm font-medium text-gray-600'
				}`}
			>
				{title}
			</h2>

			{type === 'main' && <div className="ml-3 h-px flex-1 bg-gray-200" />}
		</div>
	);
};

export default Heading;
