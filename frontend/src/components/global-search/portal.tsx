import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	const [anchorRect, setAnchorRect] = useState<null | DOMRect>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const findAndSet = () => {
			// find the visible search input (placeholder="Search")
			const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[placeholder="Search"]'));
			if (!inputs.length) return setAnchorRect(null);

			// choose the first input that's visible in the viewport
			const visible =
				inputs.find((el) => {
					const rect = el.getBoundingClientRect();
					return rect.width > 0 && rect.height > 0;
				}) || inputs[0];

			setAnchorRect(visible.getBoundingClientRect());
		};

		findAndSet();
		window.addEventListener('resize', findAndSet);
		window.addEventListener('scroll', findAndSet, true);
		const observer = new MutationObserver(findAndSet);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('resize', findAndSet);
			window.removeEventListener('scroll', findAndSet, true);
			observer.disconnect();
		};
	}, []);

	const GAP = 8; // small vertical spacing between input and results

	const style = useMemo(() => {
		if (!anchorRect) return { position: 'fixed', top: 80 + GAP, left: 20, zIndex: 9999 } as React.CSSProperties;
		return {
			position: 'absolute' as const,
			top: anchorRect.bottom + window.scrollY + GAP,
			left: anchorRect.left + window.scrollX,
			width: Math.min(360, anchorRect.width || 300),
			maxHeight: '400px',
			overflowY: 'auto',
			zIndex: 9999
		} as React.CSSProperties;
	}, [anchorRect]);

	if (typeof document === 'undefined') return null;

	return createPortal(
		<section style={style} className="bg-white shadow-md p-2 border border-gray-400 flex flex-col gap-2 rounded-sm">
			{children}
		</section>,
		document.body
	);
};

export default Portal;
