import React from 'react';

type ResultContainerProps = {
	title: string;
	children?: React.ReactNode;
};

const ResultContainer: React.FC<ResultContainerProps> = ({ title, children }) => {
	return (
		<ul role="list" aria-label={title} className="space-y-1">
			<li>
				<h3 className="font-semibold font-abel uppercase">{title}</h3>
			</li>
			{children}
		</ul>
	);
};

export default React.memo(ResultContainer);
