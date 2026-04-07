import React, { useCallback, useRef, useState } from 'react';

import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { AnimatePresence } from 'framer-motion';

import StaffGamelog from './StaffGamelog/StaffGamelog';

const TABS = [{ value: 'gamelog', label: 'Gamelog' }] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [{ value: 'gamelog', content: <StaffGamelog /> }];

const StaffContent: React.FC = React.memo(() => {
	const [activeTab, setActiveTab] = useState<string>('gamelog');
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
				<TabsList aria-label="Staff statistics sections">
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
						{content}
					</TabsContent>
				))}
			</Tabs>
		</PageContentWrapper>
	);
});

StaffContent.displayName = 'StaffContent';

export default StaffContent;
