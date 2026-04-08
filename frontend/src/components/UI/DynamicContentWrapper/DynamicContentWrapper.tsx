import { DependencyList, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface DynamicContentWrapperHandle {
	scrollToTop: () => void;
	dependencies?: DependencyList;
}

const DynamicContentWrapper = forwardRef<
	DynamicContentWrapperHandle,
	{ children: React.ReactNode; dependencies?: DependencyList }
>(function DynamicContentWrapper({ children, dependencies = [] }, ref) {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [topPx, setTopPx] = useState(600); // initial fallback

	useEffect(() => {
		if (!scrollRef.current) return;
		let raf = 0;
		const update = () => {
			if (!scrollRef.current) return;
			const rect = scrollRef.current.getBoundingClientRect();
			// rect.top = px from viewport top. If you need document Y use rect.top + window.scrollY
			setTopPx(Math.max(0, Math.round(rect.top)));
		};
		const onChange = () => {
			if (raf) cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('resize', onChange);
		window.addEventListener('scroll', onChange, { passive: true });
		const ro = new ResizeObserver(onChange);
		ro.observe(scrollRef.current);

		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener('resize', onChange);
			window.removeEventListener('scroll', onChange);
			ro.disconnect();
		};
	}, dependencies);

	useImperativeHandle(ref, () => ({
		scrollToTop: () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	}));

	return (
		<div
			ref={scrollRef}
			style={{
				maxHeight: `calc(100svh - ${topPx}px - 24px)`,
				height: '100%',
				overflowY: 'auto'
			}}
		>
			{children}
		</div>
	);
});

export default DynamicContentWrapper;
