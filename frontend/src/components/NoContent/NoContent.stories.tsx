import type { Meta, StoryObj } from '@storybook/react-vite';

import NoContent from './NoContent';

const meta = {
	title: 'UI/NoContent',
	component: NoContent,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['info', 'success', 'error']
		},
		title: { control: 'text' },
		description: { control: 'text' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof NoContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	args: {
		type: 'info',
		description: 'No games found for the selected filters.'
	}
};

export const InfoWithTitle: Story = {
	args: {
		type: 'info',
		title: 'No results',
		description: 'Try adjusting your filters or selecting a different season.'
	}
};

export const Success: Story = {
	args: {
		type: 'success',
		title: 'Data saved',
		description: 'Your changes have been saved successfully.'
	}
};

export const Error: Story = {
	args: {
		type: 'error',
		title: 'Something went wrong',
		description: 'Failed to load data. Please try again later.'
	}
};

export const DescriptionOnly: Story = {
	args: {
		type: 'info',
		description: <p>No players in the database.</p>
	}
};
