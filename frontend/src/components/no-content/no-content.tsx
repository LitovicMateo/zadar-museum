import React from 'react';

import { Info } from 'lucide-react';

const NoContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-full flex justify-center">
			<div className="flex items-center gap-3 max-w-xl w-full bg-blue-50 border border-blue-100 text-blue-800 rounded-md py-3 px-4 font-abel">
				<div className="shrink-0">
					<Info className="w-6 h-6 text-blue-500" />
				</div>
				<div className="text-left text-sm">
					{children ? children : <span>No data available — nothing was returned from the backend.</span>}
				</div>
			</div>
		</div>
	);
};

export default NoContent;
