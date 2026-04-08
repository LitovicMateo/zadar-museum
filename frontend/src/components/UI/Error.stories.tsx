import type { Meta, StoryObj } from '@storybook/react-vite';

import Error from './Error';

const meta = {
	title: 'UI/Error',
	component: Error,
	tags: ['autodocs'],
	argTypes: {
		message: { control: 'text' }
	}
} satisfies Meta<typeof Error>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		message: 'Something went wrong. Please try again.'
	}
};

export const FieldValidation: Story = {
	args: {
		message: 'This field is required.'
	}
};

export const ApiError: Story = {
	args: {
		message: 'Failed to fetch data from the server.'
	}
};
