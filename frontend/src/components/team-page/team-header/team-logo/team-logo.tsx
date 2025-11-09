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
				<div className="h-[250px] min-w-[180px] flex justify-center items-center object-cover object-top border-l-6 border-r-6 border-white shadow-md">
					<Shield size={180} color="#1c398e" strokeWidth={1} />
				</div>
			) : (
				<img
					src={imageUrl}
					alt={name}
					className="h-[250px] object-cover object-top border-l-6 border-r-6 p-4 border-white shadow-md"
				/>
			)}
		</div>
	);
};

export default TeamLogo;
