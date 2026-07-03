import React from 'react';

type SectionHeadingProps = {
	title: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => (
	<div className="mb-3 flex items-center gap-2">
		<span className="h-5 w-1 rounded-full bg-record" aria-hidden />
		<h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{title}</h2>
	</div>
);

export default SectionHeading;
