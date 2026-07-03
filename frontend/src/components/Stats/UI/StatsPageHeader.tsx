import React from 'react';

type StatsPageHeaderProps = {
	title: string;
	/** Optional entity count shown in the mono sub-line (e.g. number of players). */
	count?: number;
	/** Label following the count, e.g. "players" → "1,240 players". */
	countLabel?: string;
};

/**
 * Court-navy section hero for the /stats pages — mirrors the Coaches/Coach page
 * header treatment (Archivo black title, gold underline, DM-Mono count line) so
 * the stats section matches the rest of the app.
 */
const StatsPageHeader: React.FC<StatsPageHeaderProps> = ({ title, count, countLabel }) => {
	return (
		<div className="mb-4 rounded-xl bg-court px-6 py-5">
			<h1 className="font-display font-black uppercase tracking-tight text-white [font-size:clamp(1.5rem,4vw,2rem)]">
				{title}
			</h1>
			<div className="mt-2 h-1 w-16 rounded-full bg-record" />
			{count != null && (
				<p className="mt-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.08em] text-white/40">
					{count.toLocaleString()}
					{countLabel ? ` ${countLabel}` : ''}
				</p>
			)}
		</div>
	);
};

export default StatsPageHeader;
