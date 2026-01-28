import React from 'react';

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <div className="max-w-md w-full bg-white border-2 border-gray-200 rounded-xl shadow-md p-6">{children}</div>;
};

export default FormWrapper;
