import * as React from 'react';

import { cn } from '@/lib/Utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

import styles from './Tabs.module.css';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return <TabsPrimitive.Root data-slot="tabs" className={cn(styles.tabs, className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
	return <TabsPrimitive.List data-slot="tabs-list" className={cn(styles.tabsList, className)} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(styles.tabsTrigger, className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return <TabsPrimitive.Content data-slot="tabs-content" className={cn(styles.tabsContent, className)} {...props} />;
}

function ActiveTab() {
	return (
		<motion.div
			className={styles.activeIndicator}
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				background: '#ffffff'
				// boxShadow: `inset 1px 1px 1px rgba(0, 0, 0, 0.1),
				// 	 inset -1px -1px 1px rgba(0, 0, 0, 0.1)`
			}}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
		/>
	);
}

function ActiveTabLabel({ className, label }: React.ComponentProps<'span'> & { label: string }) {
	return <span className={cn(styles.tabsTriggerLabel, className)}>{label}</span>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, ActiveTab, ActiveTabLabel };
