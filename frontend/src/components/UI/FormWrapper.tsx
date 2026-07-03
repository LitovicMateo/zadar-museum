import React from 'react';

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <div className="w-full rounded-xl border border-border bg-card p-4 shadow-xs">{children}</div>;
};

export default FormWrapper;
