import React from 'react';

import { SidebarOpen } from 'lucide-react';

type SidebarToggleProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, setIsOpen }) => {
	return (
		<div
			className={`float-right mt-2 p-2 w-fit rounded-full text-gray-500 bg-white ${isOpen ? 'border-2 border-solid border-transparent' : 'border-2 border-solid border-gray-200'} `}
		>
			<SidebarOpen onClick={() => setIsOpen(!isOpen)} />
		</div>
	);
};

export default SidebarToggle;
