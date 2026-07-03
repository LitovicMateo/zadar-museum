import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { ArrowRight, CalendarDays } from 'lucide-react';

import crest from '@/assets/kk-zadar-logo.png';

// Public landing hero. Court Navy field with the same radial court-line glow used on
// the player hero (PlayerHero.tsx), the club crest, and two primary destinations.
const HeroBanner: React.FC = () => (
	<section className="relative isolate overflow-hidden bg-court text-white" aria-label="Muzej zadarske košarke">
		{/* Court-line glow — single ambient motif behind the wordmark */}
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 opacity-70"
			style={{
				background:
					'radial-gradient(120% 140% at 15% 115%, color-mix(in oklab, var(--record) 40%, transparent) 0%, transparent 55%)'
			}}
		/>

		<div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-14 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between md:py-24">
			<div className="min-w-0 max-w-2xl">
				<p className="font-mono text-xs uppercase tracking-[0.3em] text-record sm:text-sm">Digitalni arhiv</p>
				<h1 className="mt-3 font-display font-black uppercase leading-[0.9] tracking-tight text-white [font-size:clamp(2.5rem,8vw,5rem)]">
					Muzej zadarske košarke
				</h1>
				<div className="mt-4 h-1 w-20 rounded-full bg-record sm:w-28" />
				<p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">
					Povijest KK Zadar na jednom mjestu — igrači, treneri, timovi, utakmice, suci i dvorane kroz desetljeća
					zadarske košarke.
				</p>

				<div className="mt-8 flex flex-wrap items-center gap-3">
					<Link
						to={APP_ROUTES.players}
						className="inline-flex items-center gap-2 rounded-lg bg-record px-5 py-3 text-sm font-semibold text-record-foreground shadow-sm transition-colors hover:bg-record/90"
					>
						Istraži igrače
						<ArrowRight size={18} />
					</Link>
					<Link
						to={APP_ROUTES.games}
						className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10"
					>
						<CalendarDays size={18} />
						Pregledaj utakmice
					</Link>
				</div>
			</div>

			<div className="shrink-0 self-center rounded-3xl bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-record/40 sm:p-8">
				<img
					src={crest}
					alt="KK Zadar"
					className="h-28 w-28 object-contain sm:h-36 sm:w-36 md:h-44 md:w-44"
				/>
			</div>
		</div>
	</section>
);

export default HeroBanner;
