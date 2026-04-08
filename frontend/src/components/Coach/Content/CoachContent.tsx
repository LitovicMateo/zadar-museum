import React, { useCallback, useRef, useState } from 'react';

import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { AnimatePresence } from 'framer-motion';

import CoachCareerStats from './CoachCareerStats/CoachCareerStats';
import CoachGamelog from './CoachGamelog/CoachGamelog';
import CoachLeagueStats from './CoachLeagueStats/CoachLeagueStats';
import CoachSeasonStats from './CoachSeasonStats/CoachSeasonStats';

import styles from './CoachContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <CoachCareerStats /> },
	{ value: 'league', content: <CoachLeagueStats /> },
	{ value: 'season', content: <CoachSeasonStats /> },
	{ value: 'gamelog', content: <CoachGamelog /> }
];

const CoachContent = () => {
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
};

export default CoachContent;
