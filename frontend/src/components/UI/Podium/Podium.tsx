import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type PodiumItem = {
	id: string;
	name: string;
	to: string;
	value: ReactNode;
	meta?: string;
	avatar?: ReactNode;
};

type PodiumProps = {
	items: PodiumItem[];
	eyebrow: string;
	ariaLabel: string;
};

const Podium = ({ items, eyebrow, ariaLabel }: PodiumProps) => {
	const [first, ...runnersUp] = items;
	if (!first) return null;

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label={ariaLabel}>
			{/* #1 */}
			<div className="relative overflow-hidden rounded-xl bg-court p-5 text-white shadow-md sm:col-span-2">
				<div className="flex items-center justify-between gap-4">
					<div className="flex min-w-0 items-center gap-3">
						{first.avatar && <span className="h-12 w-12 shrink-0 rounded-full ring-2 ring-white/20">{first.avatar}</span>}
						<div className="min-w-0">
							<span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-record">
								{eyebrow}
							</span>
							<Link
								to={first.to}
								className="mt-1 block truncate text-xl font-bold text-white transition-colors hover:text-record sm:text-2xl"
							>
								{first.name}
							</Link>
							{first.meta && (
								<span className="font-mono text-xs uppercase tracking-[0.08em] text-white/60">{first.meta}</span>
							)}
						</div>
					</div>
					<span className="shrink-0 font-display text-5xl font-black leading-none tabular-nums text-record sm:text-6xl">
						{first.value}
					</span>
				</div>
				<div className="mt-4 h-1 w-16 rounded-full bg-record" />
			</div>

			{/* #2 / #3 */}
			{runnersUp.map((item, index) => (
				<div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
					<div className="flex items-center justify-between gap-3">
						<span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-muted-foreground">
							{index + 2}
						</span>
						<span className="font-display text-2xl font-bold leading-none tabular-nums text-foreground">
							{item.value}
						</span>
					</div>
					<div className="mt-2 flex items-center gap-2">
						{item.avatar && <span className="h-9 w-9 shrink-0 rounded-full">{item.avatar}</span>}
						<Link
							to={item.to}
							className="min-w-0 truncate font-medium text-foreground transition-colors hover:text-primary"
						>
							{item.name}
						</Link>
					</div>
					{item.meta && (
						<span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">{item.meta}</span>
					)}
				</div>
			))}
		</div>
	);
};

export default Podium;
