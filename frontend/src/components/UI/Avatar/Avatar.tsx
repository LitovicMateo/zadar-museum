import { User } from 'lucide-react';

import { cn } from '@/lib/Utils';
import { getImageUrl } from '@/utils/GetImageUrl';

type AvatarProps = {
	src?: string | null;
	alt: string;
	className?: string;
};

/** Circular profile image for a person (player/coach) with a User-icon fallback. */
const Avatar = ({ src, alt, className }: AvatarProps) => {
	if (!src) {
		return (
			<div
				className={cn('flex items-center justify-center rounded-full bg-muted text-muted-foreground', className)}
				aria-label={alt}
			>
				<User className="h-1/2 w-1/2" strokeWidth={1.5} />
			</div>
		);
	}

	return <img src={getImageUrl(src)} alt={alt} className={cn('rounded-full bg-muted object-cover', className)} />;
};

export default Avatar;
