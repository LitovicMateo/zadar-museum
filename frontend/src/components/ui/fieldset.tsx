import React from 'react';

import Heading from './heading';

type FieldsetProps = {
	children?: React.ReactNode;
	label: string;
};

const Fieldset: React.FC<FieldsetProps> = ({ children, label }) => {
	return (
		<fieldset className="mb-4 flex flex-col gap-2">
			<Heading title={label} type="secondary" />
			{/* <legend className="text-md font-semibold text-gray-700 py-1 px-2 border-1 border-solid border-gray-500 bg-gray-50 rounded-md">
				{label}
			</legend> */}
			{children}
		</fieldset>
	);
};

export default Fieldset;
