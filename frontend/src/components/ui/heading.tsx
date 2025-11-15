import React from 'react';

type HeadingProps = {
	title: string;
	type?: 'main' | 'secondary';
};

const Heading: React.FC<HeadingProps> = ({ title, type = 'main' }) => {
	return (
		<div className="flex gap-3 items-center">
			<div className={`h-6 ${type === 'main' ? 'h-6 w-3' : 'h-4 w-1'} bg-[#194F95] `} />
			<h2 className={`${type === 'main' ? 'text-3xl uppercase' : 'text-2xl'} font-abel whitespace-nowrap`}>
				{title}
			</h2>
			{type === 'main' && <div className="h-6 w-full bg-[#194F95] " />}
		</div>
	);
};

export default Heading;
