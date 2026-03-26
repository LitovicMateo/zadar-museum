import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { StaffDetailsResponse } from '@/types/api/Staff';
import { getImageUrl } from '@/utils/GetImageUrl';
import { User } from 'lucide-react';

import styles from './StaffCard.module.css';

interface StaffCardProps {
	staff: StaffDetailsResponse;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff }) => {
	const imageUrl = staff.image?.url ? getImageUrl(staff.image.url) : '';
	const hasImage = !!imageUrl && !imageUrl.includes('undefined');

	return (
		<Link to={APP_ROUTES.staff(staff.documentId)} className={styles.card}>
			<div className={styles.imageWrapper}>
				{hasImage ? (
					<img
						src={imageUrl}
						alt={`${staff.first_name} ${staff.last_name}`}
						className={styles.image}
						loading="lazy"
					/>
				) : (
					<User size={64} color="var(--muted-foreground)" strokeWidth={1} />
				)}
			</div>

			<div className={styles.body}>
				<div className={styles.name}>
					<span className={styles.firstName}>{staff.first_name} </span>
					{staff.last_name}
				</div>{' '}
				<div className={styles.meta}>
					{staff.role && <span className={styles.positionBadge}>ROLE</span>}
					{staff.role && (
						<>
							<span className={styles.dot} />
							<span className={styles.positionBadge}>{staff.role}</span>
						</>
					)}
				</div>
			</div>
		</Link>
	);
};

export default StaffCard;
