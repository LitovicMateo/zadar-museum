import React from 'react';

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className="w-full">
			<h2 className="py-4 font-bold uppercase font-mono text-2xl text-center text-gray-500">{title}</h2>
		</div>
	);
};

export default SidebarTitle;
