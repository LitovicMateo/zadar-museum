import React from 'react';

import { Shield } from 'lucide-react';

import { cn } from '@/lib/Utils';
import { StrapiImage } from '@/types/api/Strapi';
import { getImageUrl } from '@/utils/GetImageUrl';

type TeamLogoProps = {
	name?: string | null;
	image?: StrapiImage;
	className?: string;
};

const TeamLogo: React.FC<TeamLogoProps> = ({ name, image, className }) => {
	const url = image?.formats?.thumbnail?.url ?? image?.url;

	if (!url) {
		return (
			<div
				className={cn(
					'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
					className
				)}
				aria-label={name ?? 'Team logo'}
			>
				<Shield className="h-1/2 w-1/2" strokeWidth={1.5} />
			</div>
		);
	}

	return (
		<img
			src={getImageUrl(url)}
			alt={name ?? 'Team logo'}
			className={cn('rounded-full object-contain', className)}
		/>
	);
};

export default TeamLogo;
