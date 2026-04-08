import type { Meta, StoryObj } from '@storybook/react-vite';

import SubmitButton from './SubmitButton';

const meta = {
	title: 'UI/SubmitButton',
	component: SubmitButton,
	tags: ['autodocs'],
	argTypes: {
		isSubmitting: { control: 'boolean' },
		label: { control: 'text' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
	args: {
		isSubmitting: false,
		label: 'Save changes'
	}
};

export const Submitting: Story = {
	args: {
		isSubmitting: true,
		label: 'Save changes'
	}
};

export const LongLabel: Story = {
	args: {
		isSubmitting: false,
		label: 'Save all player statistics'
	}
};
