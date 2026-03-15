import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import PaginationControls from './PaginationControls';

const meta = {
	title: 'UI/PaginationControls',
	component: PaginationControls,
	tags: ['autodocs'],
	argTypes: {
		total: { control: 'number' },
		pageSize: { control: 'number' },
		page: { control: 'number' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof PaginationControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { total: 87, page: 1, pageSize: 10, onPageChange: () => {}, onPageSizeChange: () => {} },
	render: (args) => {
		const [page, setPage] = useState(args.page);
		const [pageSize, setPageSize] = useState(args.pageSize);
		return (
			<PaginationControls
				total={args.total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
			/>
		);
	}
};

export const FirstPage: Story = {
	args: { total: 50, page: 1, pageSize: 10, onPageChange: () => {}, onPageSizeChange: () => {} },
	render: (args) => {
		const [page, setPage] = useState(args.page);
		const [pageSize, setPageSize] = useState(args.pageSize);
		return (
			<PaginationControls
				total={args.total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
			/>
		);
	}
};

export const LastPage: Story = {
	args: { total: 50, page: 5, pageSize: 10, onPageChange: () => {}, onPageSizeChange: () => {} },
	render: (args) => {
		const [page, setPage] = useState(args.page);
		const [pageSize, setPageSize] = useState(args.pageSize);
		return (
			<PaginationControls
				total={args.total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
			/>
		);
	}
};

export const NoResults: Story = {
	args: { total: 0, page: 1, pageSize: 10, onPageChange: () => {}, onPageSizeChange: () => {} }
};

export const SinglePage: Story = {
	args: { total: 12, page: 1, pageSize: 50, onPageChange: () => {}, onPageSizeChange: () => {} },
	render: (args) => {
		const [page, setPage] = useState(args.page);
		const [pageSize, setPageSize] = useState(args.pageSize);
		return (
			<PaginationControls
				total={args.total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
			/>
		);
	}
};
