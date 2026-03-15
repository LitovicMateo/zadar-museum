import { Meta, StoryObj } from '@storybook/react';

import ProfilePageWrapper from './ProfilePageWrapper';

const meta: Meta<typeof ProfilePageWrapper> = {
	title: 'UI/ProfilePageWrapper',
	component: ProfilePageWrapper
};

export default meta;
type Story = StoryObj<typeof ProfilePageWrapper>;

export const Default: Story = {
	render: (args) => (
		<ProfilePageWrapper
			{...args}
			header={
				<div style={{ padding: '1rem', background: '#e0f2fe' }}>
					<h2 style={{ margin: 0 }}>Player Header</h2>
				</div>
			}
			content={
				<div style={{ padding: '1rem' }}>
					<p>Player content goes here.</p>
				</div>
			}
		/>
	)
};
