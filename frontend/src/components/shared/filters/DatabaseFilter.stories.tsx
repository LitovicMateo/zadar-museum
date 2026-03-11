import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DatabaseFilter from './DatabaseFilter';
import { PlayerDB } from '@/pages/Player/Player';

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

export const ZadarSelected: Story = {
	render: () => {
		const [database, setDatabase] = useState<PlayerDB>('zadar');
		return <DatabaseFilter database={database} setDatabase={setDatabase} />;
	}
};

export const OpponentsSelected: Story = {
	render: () => {
		const [database, setDatabase] = useState<PlayerDB>('opponent');
		return <DatabaseFilter database={database} setDatabase={setDatabase} />;
	}
};
