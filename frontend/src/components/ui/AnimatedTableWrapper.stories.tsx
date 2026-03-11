import type { Meta, StoryObj } from '@storybook/react-vite';

import AnimatedTableWrapper from './AnimatedTableWrapper';

// Minimal table content used inside the wrapper.
const SampleTableContent = ({ rows }: { rows: number }) => (
	<>
		<thead>
			<tr>
				<th style={{ padding: '8px 12px', textAlign: 'left' }}>Name</th>
				<th style={{ padding: '8px 12px', textAlign: 'right' }}>Games</th>
				<th style={{ padding: '8px 12px', textAlign: 'right' }}>Points</th>
			</tr>
		</thead>
		<tbody>
			{Array.from({ length: rows }, (_, i) => (
				<tr key={i}>
					<td style={{ padding: '8px 12px' }}>Player {i + 1}</td>
					<td style={{ padding: '8px 12px', textAlign: 'right' }}>{20 + i}</td>
					<td style={{ padding: '8px 12px', textAlign: 'right' }}>{(15 + i).toFixed(1)}</td>
				</tr>
			))}
		</tbody>
	</>
);

const meta = {
	title: 'UI/AnimatedTableWrapper',
	component: AnimatedTableWrapper,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof AnimatedTableWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FewRows: Story = {
	args: {
		children: <SampleTableContent rows={3} />
	}
};

export const ManyRows: Story = {
	args: {
		children: <SampleTableContent rows={12} />
	}
};

export const SingleRow: Story = {
	args: {
		children: <SampleTableContent rows={1} />
	}
};
