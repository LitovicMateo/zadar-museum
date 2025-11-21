import React from 'react';

import { ChevronLeft } from 'lucide-react';

type SidebarToggleProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, setIsOpen }) => {
	return (
		<button
			aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
			onClick={() => setIsOpen(!isOpen)}
			className="ml-auto inline-flex items-center justify-center p-1 rounded-md bg-transparent text-gray-500 hover:text-gray-700 hover:bg-blue-50/50 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-100"
		>
			<ChevronLeft className={`w-3 h-3 transform transition-transform ${isOpen ? '' : 'rotate-180'}`} />
		</button>
	);
};

export default SidebarToggle;
