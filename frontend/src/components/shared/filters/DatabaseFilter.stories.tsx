import { useState } from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DatabaseFilter from './DatabaseFilter';

const meta = {
	title: 'Filters/DatabaseFilter',
	component: DatabaseFilter,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof DatabaseFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MainTeamSelected: Story = {
	args: {
		database: 'main' as PlayerDB,
		setDatabase: (database: PlayerDB) => {
			void database;
		}
	},
	render: () => {
		const [database, setDatabase] = useState<PlayerDB>('main');
		return <DatabaseFilter database={database} setDatabase={setDatabase} />;
	}
};

export const OpponentsSelected: Story = {
	args: {
		database: 'opponent' as PlayerDB,
		setDatabase: (database: PlayerDB) => {
			void database;
		}
	},
	render: () => {
		const [database, setDatabase] = useState<PlayerDB>('opponent');
		return <DatabaseFilter database={database} setDatabase={setDatabase} />;
	}
};
