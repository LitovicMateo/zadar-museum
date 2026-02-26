import React from 'react';

type HeadingProps = {
	title: string;
	type?: 'main' | 'secondary';
	id?: string;
};

const Heading: React.FC<HeadingProps> = ({ title, type = 'main', id }) => {
	return (
		<div className="flex items-center gap-3 mb-2">
			<div
				className={`${type === 'main' ? 'w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-700' : 'w-1 h-6 bg-blue-600'} rounded-full shrink-0 shadow-sm`}
			/>

			<h2
				id={id}
				className={`${
					type === 'main'
						? 'text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
						: 'text-lg font-semibold text-gray-700'
				}`}
			>
				{title}
			</h2>

			{type === 'main' && (
				<div className="ml-3 h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-transparent rounded-full" />
			)}
		</div>
	);
};

export default Heading;
