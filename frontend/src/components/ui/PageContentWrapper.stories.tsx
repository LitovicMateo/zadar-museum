import type { Meta, StoryObj } from '@storybook/react-vite';

import PageContentWrapper from './PageContentWrapper';

const meta = {
	title: 'UI/PageContentWrapper',
	component: PageContentWrapper,
	tags: ['autodocs'],
	argTypes: {
		width: { control: 'text' },
		fillHeight: { control: 'boolean' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof PageContentWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
	<div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '0.375rem' }}>
		<p style={{ margin: 0, color: '#475569' }}>Page content goes here</p>
	</div>
);

export const Default: Story = {
	args: {
		children: <SampleContent />
	}
};

export const ConstrainedWidth: Story = {
	args: {
		width: '600px',
		children: <SampleContent />
	}
};

export const NarrowWidth: Story = {
	args: {
		width: '320px',
		children: <SampleContent />
	}
};

export const FillHeight: Story = {
	args: {
		fillHeight: true,
		children: <SampleContent />
	},
	parameters: {
		layout: 'fullscreen'
	}
};
