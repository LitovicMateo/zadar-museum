import React from 'react';

import Heading from './heading';

type FieldsetProps = {
	children?: React.ReactNode;
	label: string;
};

const Fieldset: React.FC<FieldsetProps> = ({ children, label }) => {
	return (
		<fieldset className="mb-3 bg-white border border-gray-100 rounded-md p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
			<Heading title={label} type="secondary" />
			<div className="mt-3 flex flex-col gap-2">{children}</div>
		</fieldset>
	);
};

export default Fieldset;
