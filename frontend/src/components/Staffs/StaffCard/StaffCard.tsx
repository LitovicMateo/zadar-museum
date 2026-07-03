import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { APP_ROUTES } from '@/constants/Routes';
import { StaffDetailsResponse } from '@/types/api/Staff';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './StaffCard.module.css';

interface StaffCardProps {
	staff: StaffDetailsResponse;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff }) => {
	const imageUrl = staff.image?.url ? getImageUrl(staff.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.staff(staff.documentId)} className={styles.cardLink}>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					{hasImage ? (
						<img
							src={imageUrl}
							alt={`${staff.first_name} ${staff.last_name}`}
							className={styles.image}
							loading="lazy"
						/>
					) : (
						<div className={styles.placeholder}>
							<User size={52} strokeWidth={1} opacity={0.4} />
						</div>
					)}

					<div className={styles.gradient} />

					<div className={styles.nameplate}>
						{staff.role && (
							<Badge variant="outline" className={styles.roleBadge}>
								{staff.role}
							</Badge>
						)}
						<p className={styles.name}>
							<span className={styles.firstName}>{staff.first_name} </span>
							<span className={styles.lastName}>{staff.last_name}</span>
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default StaffCard;
