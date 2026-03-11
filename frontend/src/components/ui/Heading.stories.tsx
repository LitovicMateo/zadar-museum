import type { Meta, StoryObj } from '@storybook/react-vite';

import Heading from './Heading';

const meta = {
	title: 'UI/Heading',
	component: Heading,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		type: {
			control: 'select',
			options: ['main', 'secondary']
		}
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
	args: {
		title: 'Season Statistics',
		type: 'main'
	}
};

export const Secondary: Story = {
	args: {
		title: 'Personal Info',
		type: 'secondary'
	}
};

export const BothTypes: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<Heading title="Season Statistics" type="main" />
			<Heading title="Personal Info" type="secondary" />
			<Heading title="Career Highs" type="secondary" />
		</div>
	)
};
