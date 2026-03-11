import React from 'react';

import { Shield } from 'lucide-react';

type TeamLogoProps = {
	imageUrl: string;
	name: string;
};

const wrapperStyle = 'h-full flex justify-center items-center object-cover bg-white';

const TeamLogo: React.FC<TeamLogoProps> = ({ imageUrl, name }) => {
	return (
		<div className={wrapperStyle}>
			{imageUrl.includes('undefined') ? (
				<div className="h-full w-full sm:h-[250px] sm:min-w-[180px] flex justify-center items-center object-contain sm:object-cover border-0 sm:border-l-6 sm:border-r-6 sm:border-white shadow-md bg-white">
					<Shield size={64} className="sm:hidden" color="#1c398e" strokeWidth={1} />
					<Shield size={180} className="hidden sm:block" color="#1c398e" strokeWidth={1} />
				</div>
			) : (
				<img
					src={imageUrl}
					alt={name}
					className="h-full w-full sm:h-[250px] sm:w-auto sm:min-w-[180px] object-contain sm:object-cover border-0 sm:border-l-6 sm:border-r-6 sm:border-white shadow-md"
				/>
			)}
		</div>
	);
};

export default TeamLogo;
