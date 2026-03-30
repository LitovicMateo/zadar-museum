import React, { useCallback, useRef, useState } from 'react';

import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { AnimatePresence } from 'framer-motion';

import RefereeCareerStats from './RefereeCareerStats/RefereeCareerStats';
import RefereeGamelog from './RefereeGamelog/RefereeGamelog';
import RefereeLeagueStats from './RefereeLeagueStats/RefereeLeagueStats';
import RefereeSeasonStats from './RefereeSeasonStats/RefereeSeasonStats';

import styles from './RefereeContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <RefereeCareerStats /> },
	{ value: 'league', content: <RefereeLeagueStats /> },
	{ value: 'season', content: <RefereeSeasonStats /> },
	{ value: 'gamelog', content: <RefereeGamelog /> }
];

const RefereeContent = () => {
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

export default RefereeContent;
