import React from 'react';

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <div className="max-w-md w-full">{children}</div>;
};

export default FormWrapper;
