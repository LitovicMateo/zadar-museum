import type { Meta, StoryObj } from '@storybook/react-vite';

import Fieldset from './Fieldset';
import { Input } from './Input';

const meta = {
	title: 'UI/Fieldset',
	component: Fieldset,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInputs: Story = {
	args: {
		label: 'Personal Information',
		children: (
			<>
				<Input placeholder="First name" />
				<Input placeholder="Last name" />
				<Input placeholder="Nationality" />
			</>
		)
	}
};

export const SingleInput: Story = {
	args: {
		label: 'Contact',
		children: <Input placeholder="Email address" />
	}
};

export const NestedFieldsets: Story = {
	args: { label: 'Personal Information' },
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<Fieldset label="Personal Information">
				<Input placeholder="First name" />
				<Input placeholder="Last name" />
			</Fieldset>
			<Fieldset label="Career">
				<Input placeholder="Position" />
				<Input placeholder="Nationality" />
			</Fieldset>
		</div>
	)
};
