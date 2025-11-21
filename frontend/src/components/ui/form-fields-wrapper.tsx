import React from 'react';

const FormFieldsWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className="flex flex-col gap-3">{children}</div>;
};

export default FormFieldsWrapper;
