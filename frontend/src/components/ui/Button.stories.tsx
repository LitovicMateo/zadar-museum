import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2 } from 'lucide-react';

import Button from './Button';

const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon']
		},
		disabled: { control: 'boolean' }
	}
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Save changes',
		variant: 'default'
	}
};

export const Destructive: Story = {
	args: {
		children: 'Delete',
		variant: 'destructive'
	}
};

export const Outline: Story = {
	args: {
		children: 'Cancel',
		variant: 'outline'
	}
};

export const Secondary: Story = {
	args: {
		children: 'Secondary action',
		variant: 'secondary'
	}
};

export const Ghost: Story = {
	args: {
		children: 'Ghost',
		variant: 'ghost'
	}
};

export const Link: Story = {
	args: {
		children: 'Go to page',
		variant: 'link'
	}
};

export const Small: Story = {
	args: {
		children: 'Small',
		size: 'sm'
	}
};

export const Large: Story = {
	args: {
		children: 'Large',
		size: 'lg'
	}
};

export const IconButton: Story = {
	args: {
		size: 'icon',
		variant: 'destructive',
		children: <Trash2 />
	}
};

export const Disabled: Story = {
	args: {
		children: 'Not available',
		disabled: true
	}
};

export const WithLeadingIcon: Story = {
	args: {
		children: (
			<>
				<Trash2 />
				Delete item
			</>
		),
		variant: 'destructive'
	}
};
