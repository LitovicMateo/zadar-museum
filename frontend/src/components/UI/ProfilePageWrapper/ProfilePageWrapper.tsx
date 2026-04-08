import React from 'react';

import styles from './ProfilePageWrapper.module.css';

interface ProfilePageWrapperProps {
	header?: React.ReactNode;
	content?: React.ReactNode;
}

const ProfilePageWrapper: React.FC<ProfilePageWrapperProps> = ({ header, content }) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<div className={styles.headerContent}>{header}</div>
			</div>
			<div className={styles.content}>
				<div className={styles.contentInner}>{content}</div>
			</div>
		</div>
	);
};

export default ProfilePageWrapper;
