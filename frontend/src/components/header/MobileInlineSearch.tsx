import React from 'react';

import GlobalSearch from '@/components/global-search/global-search';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
	open: boolean;
}

const MobileInlineSearch: React.FC<Props> = ({ open }) => {
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					id="mobile-inline-search"
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.18 }}
					className="w-full bg-white border-b overflow-hidden"
				>
					<div className="max-w-[900px] mx-auto px-4 py-2 flex justify-center">
						<div className="w-full max-w-md">
							<GlobalSearch />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default MobileInlineSearch;
