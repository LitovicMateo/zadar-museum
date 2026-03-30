import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './Portal.module.css';

interface PortalProps {
	children?: React.ReactNode;
	anchorRef: React.RefObject<HTMLInputElement | null>;
}

const Portal: React.FC<PortalProps> = ({ children, anchorRef }) => {
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

	useEffect(() => {
		const updateRect = () => {
			if (anchorRef.current) {
				setAnchorRect(anchorRef.current.getBoundingClientRect());
			}
		};

		updateRect();
		window.addEventListener('resize', updateRect);
		window.addEventListener('scroll', updateRect, true);

		return () => {
			window.removeEventListener('resize', updateRect);
			window.removeEventListener('scroll', updateRect, true);
		};
	}, [anchorRef]);

	const GAP = 8;

	const style = useMemo((): React.CSSProperties => {
		if (!anchorRect) return { position: 'fixed', top: 80 + GAP, left: 20, zIndex: 9999 };
		return {
			position: 'absolute',
			top: anchorRect.bottom + window.scrollY + GAP,
			left: anchorRect.left + window.scrollX,
			width: Math.min(360, anchorRect.width || 300),
			maxHeight: '400px',
			overflowY: 'auto',
			zIndex: 9999
		};
	}, [anchorRect]);

	if (typeof document === 'undefined') return null;

	return createPortal(
		<section style={style} className={styles.portal} aria-label="Search results">
			{children}
		</section>,
		document.body
	);
};

export default Portal;
