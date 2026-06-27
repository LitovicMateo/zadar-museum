import React, { useState } from 'react';

import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { AnimatePresence } from 'framer-motion';

import PageWrapper from '../UI/PageWrapper';
import CoachCompare from './CoachCompare';
import PlayerCompare from './PlayerCompare';

const TABS = [
	{ value: 'player', label: 'Players' },
	{ value: 'coach', label: 'Coaches' }
] as const;

const ComparePage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>('player');

	return (
		<PageWrapper>
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList aria-label="Compare entity type">
					{TABS.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							<AnimatePresence>{activeTab === tab.value && <ActiveTab />}</AnimatePresence>
							<ActiveTabLabel label={tab.label} />
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="player">
					<PlayerCompare />
				</TabsContent>
				<TabsContent value="coach">
					<CoachCompare />
				</TabsContent>
			</Tabs>
		</PageWrapper>
	);
};

export default ComparePage;
