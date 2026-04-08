import type { Meta, StoryObj } from '@storybook/react-vite';

import StatCard from './StatCard';

const meta = {
	title: 'UI/StatCard',
	component: StatCard,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		value: { control: 'text' },
		rank: { control: 'number' },
		showBorder: { control: 'boolean' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRank: Story = {
	args: {
		label: 'Points',
		value: '21.4',
		rank: 3,
		showBorder: true
	}
};

export const WithoutRank: Story = {
	args: {
		label: 'Games Played',
		value: 82,
		showBorder: true
	}
};

export const NoBorder: Story = {
	args: {
		label: 'Assists',
		value: '7.2',
		rank: 1,
		showBorder: false
	}
};

export const List: Story = {
	args: {
		label: 'Points',
		value: '21.4'
	},
	parameters: {
		layout: 'padded'
	},
	render: () => (
		<div style={{ width: 320, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
			{[
				{ label: 'Points', value: '21.4', rank: 3 },
				{ label: 'Assists', value: '7.2', rank: 1 },
				{ label: 'Rebounds', value: '5.8', rank: 7 },
				{ label: 'Games', value: 78 }
			].map((s, i, arr) => (
				<StatCard key={s.label} {...s} showBorder={i < arr.length - 1} />
			))}
		</div>
	)
};
