import React from 'react';

import { User } from 'lucide-react';

type CoachImage = {
	imageUrl: string;
	name: string;
};

const wrapperStyle = 'h-full flex justify-center items-center object-cover';

const CoachImage: React.FC<CoachImage> = ({ imageUrl, name }) => {
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<div className={wrapperStyle}>
			{!hasImage ? (
				<div
					className="h-[250px] min-w-[180px] flex justify-center items-center object-cover object-top border-l-6 border-r-6 border-white shadow-md"
					aria-hidden="true"
				>
					<User aria-hidden="true" size={180} color="#fff" strokeWidth={1} />
				</div>
			) : (
				<img
					src={imageUrl}
					alt={name || 'Coach image'}
					loading="lazy"
					className="h-[250px] object-cover object-top border-l-6 border-r-6 border-white shadow-md"
				/>
			)}
		</div>
	);
};

export default React.memo(CoachImage);
