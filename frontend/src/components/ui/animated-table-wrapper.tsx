import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import TableWrapper from './table-wrapper';

/**
 * Drop-in replacement for TableWrapper that animates height changes when the
 * number of rendered rows changes (e.g. when the user picks a different page
 * size via PaginationControls).
 *
 * Why useEffect (post-paint) and not useLayoutEffect (pre-paint):
 * - useLayoutEffect fires before the browser paints. Calling setState inside it
 *   triggers a synchronous React re-render, also before paint. Framer-motion
 *   never sees a committed painted frame at the old height, so it treats the
 *   animate prop change as immediate and snaps — especially on shrink.
 * - useEffect fires after the browser has painted one frame. At that point the
 *   motion.div is still at the old controlled height (state hasn't changed),
 *   so framer-motion has a real "from" position. When setState fires, it
 *   animates smoothly in both directions.
 *
 * The innerRef div is unconstrained so offsetHeight always reflects the true
 * natural height of the content, regardless of what the outer motion.div is
 * currently animating to.
 */
const AnimatedTableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const innerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | 'auto'>('auto');

	// No dependency array — runs after every render so height stays in sync.
	// setState with the same value is a no-op in React 18, so there is no
	// render loop when the height is stable.
	useEffect(() => {
		if (!innerRef.current) return;
		setHeight(innerRef.current.offsetHeight);
	});

	return (
		<motion.div
			animate={{ height }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			style={{ overflow: 'hidden' }}
		>
			<div ref={innerRef}>
				<TableWrapper>{children}</TableWrapper>
			</div>
		</motion.div>
	);
};

export default AnimatedTableWrapper;
