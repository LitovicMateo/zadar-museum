import React from 'react';

type ErrorProps = {
	message: string;
};

const Error: React.FC<ErrorProps> = ({ message }) => {
	return <p className="text-red-600">{message}</p>;
};

export default Error;
