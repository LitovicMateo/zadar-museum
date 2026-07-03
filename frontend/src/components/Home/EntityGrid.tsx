import React from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { BarChart2, Flag, MapPin, Medal, Trophy, User, UserCog, Users } from 'lucide-react';

// Entry points into the archive. Mirrors the Header nav (Header.tsx) but as a
// browseable grid on the landing page. Croatian labels.
const sections = [
	{ label: 'Igrači', link: APP_ROUTES.players, icon: User },
	{ label: 'Timovi', link: APP_ROUTES.teams, icon: Users },
	{ label: 'Utakmice', link: APP_ROUTES.games, icon: Trophy },
	{ label: 'Treneri', link: APP_ROUTES.coaches, icon: UserCog },
	{ label: 'Suci', link: APP_ROUTES.referees, icon: Flag },
	{ label: 'Natjecanja', link: APP_ROUTES.leagues, icon: Medal },
	{ label: 'Dvorane', link: APP_ROUTES.venues, icon: MapPin },
	{ label: 'Statistika', link: APP_ROUTES.stats.default, icon: BarChart2 }
] as const;

const EntityGrid: React.FC = () => (
	<section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
		<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Istraži arhiv</h2>
		<div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
			{sections.map(({ label, link, icon: Icon }) => (
				<Link key={label} to={link} className="group focus:outline-none">
					<Card className="h-full gap-3 py-5 transition-colors group-hover:border-court group-focus-visible:border-court">
						<div className="flex flex-col items-center gap-3 px-5 text-center">
							<span className="flex h-11 w-11 items-center justify-center rounded-lg bg-court text-court-foreground">
								<Icon size={22} />
							</span>
							<p className="font-display text-lg font-bold leading-tight">{label}</p>
						</div>
					</Card>
				</Link>
			))}
		</div>
	</section>
);

export default EntityGrid;
