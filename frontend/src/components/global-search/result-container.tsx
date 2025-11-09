import React from 'react';

type ResultContainerProps = {
	title: string;
	children?: React.ReactNode;
};
const ResultContainer: React.FC<ResultContainerProps> = ({ title, children }) => {
	return (
		<ul>
			<li className="font-semibold font-abel uppercase">{title}</li>
			{children}
		</ul>
	);
};

export default ResultContainer;
