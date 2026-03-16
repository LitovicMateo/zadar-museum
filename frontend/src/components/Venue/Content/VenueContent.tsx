import React, { useCallback, useRef, useState } from 'react';

import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { AnimatePresence } from 'framer-motion';

import VenueAllTimeStats from './VenueAllTimeStats/VenueAllTimeStats';

import styles from './VenueContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'player records', label: 'Player Records' },
	{ value: 'team records', label: 'Team Records' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <VenueAllTimeStats /> },
	{ value: 'league', content: <></> },
	{ value: 'season', content: <></> },
	{ value: 'gamelog', content: <></> },
	{ value: 'player records', content: <></> }
];

const VenueContent: React.FC = React.memo(() => {
	const [activeTab, setActiveTab] = useState<string>('alltime');
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const handleTabChange = useCallback((value: string) => {
		setActiveTab(value);
		const el = tabRefs.current[value];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
		}
	}, []);

	return (
		<PageContentWrapper>
			<Tabs value={activeTab} onValueChange={handleTabChange}>
				<TabsList aria-label="Player statistics sections">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							ref={(el) => {
								tabRefs.current[tab.value] = el;
							}}
						>
							<AnimatePresence>{activeTab === tab.value && <ActiveTab />}</AnimatePresence>
							<ActiveTabLabel label={tab.label} />
						</TabsTrigger>
					))}
				</TabsList>

				{TAB_PANELS.map(({ value, content }) => (
					<TabsContent key={value} value={value}>
						<div className={styles.contentWrapper}>{content}</div>
					</TabsContent>
				))}
			</Tabs>
		</PageContentWrapper>
	);
});

VenueContent.displayName = 'VenueContent';

export default VenueContent;
