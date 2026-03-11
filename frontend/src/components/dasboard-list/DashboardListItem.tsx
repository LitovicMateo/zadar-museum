import React, { useEffect, useRef, useState } from 'react';
import styles from './DashboardListItem.module.css';

type DashboardListItemProps = {
	item: {
		id: number;
		item: React.ReactElement;
		createdAt: string;
	};
};

const DashboardListItem: React.FC<DashboardListItemProps> = ({ item }) => {
	const date = `${item.createdAt}`.split('T')[0].split('-').reverse().join('/');
	const contentRef = useRef<HTMLDivElement | null>(null);
	const [tooltip, setTooltip] = useState<string | undefined>(undefined);

	useEffect(() => {
		// derive visible text from rendered element for tooltip
		const text = contentRef.current?.textContent?.trim();
		if (text && text.length > 0) setTooltip(text);
	}, []);

	return (
		<tr className={styles.row}>
			<td className="py-3 px-4 align-middle">
				<div
					ref={contentRef}
					title={tooltip}
					className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors duration-200"
					style={{ maxWidth: 'min(46ch, 100%)' }}
				>
					{item.item}
				</div>
			</td>
			<td className={styles.tdDate}>
				<div className={styles.date}>{date}</div>
			</td>
		</tr>
	);
};

export default DashboardListItem;
