import React from 'react';
import DashboardListItem from './DashboardListItem';
import styles from './DashboardListContent.module.css';

type DashboardListContentProps = {
	title: string;
	header: string;
	items?: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	}[];
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
};

const DashboardListContent: React.FC<DashboardListContentProps> = ({
	header,
	items,
	isError,
	isLoading,
	errorMessage,
	title
}) => {
	if (isLoading) {
		return <p className={styles.loading}>Loading...</p>;
	}
	if (isError) {
		return <p className={styles.error}>{errorMessage}</p>;
	}

	if (!items?.length) {
		return <p className={styles.empty}>No {title.toLowerCase()} found</p>;
	}

	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
					<thead className={styles.thead}>
						<tr className={styles.theadRow}>
							<th className={`${styles.th} ${styles.thLeft}`}>
								{header}
							</th>
							<th className={`${styles.th} ${styles.thRight}`}>
								Date
							</th>
						</tr>
					</thead>
					<tbody className={styles.tbody}>
						{items.map((it) => (
							<DashboardListItem key={it.id} item={it} />
						))}
					</tbody>
				</table>
		</div>
	);
};

export default DashboardListContent;
