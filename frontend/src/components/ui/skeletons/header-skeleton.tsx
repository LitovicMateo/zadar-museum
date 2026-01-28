import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { zadarBg } from '@/constants/player-bg';

const HeaderSkeleton: React.FC = () => {
	return (
		<section className={`max-h-[250px] ${zadarBg} drop-shadow-xl overflow-hidden`}>
			<div className="h-full w-full relative max-w-[800px] flex gap-6 justify-start items-end mx-auto p-4">
				<Skeleton className="h-[200px] w-[150px] rounded-lg" />
				<div className="flex flex-col gap-2 pb-4 flex-1">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-6 w-40" />
				</div>
				<Skeleton className="h-24 w-24 rounded-full mb-4" />
			</div>
		</section>
	);
};

export default HeaderSkeleton;
