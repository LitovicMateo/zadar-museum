import React from 'react';

type HeadingProps = {
	title: string;
	type?: 'main' | 'secondary';
};

const Heading: React.FC<HeadingProps> = ({ title, type = 'main' }) => {
	return (
		<div className="flex gap-3 items-center">
			<div className={`h-[24px] ${type === 'main' ? 'h-[24px] w-[12px]' : 'h-[16px] w-[4px]'} bg-[#194F95] `} />
			<h2 className={`${type === 'main' ? 'text-3xl uppercase' : 'text-2xl'} font-abel whitespace-nowrap`}>
				{title}
			</h2>
			{type === 'main' && <div className="h-[24px] w-full bg-[#194F95] " />}
		</div>
	);
};

export default Heading;
