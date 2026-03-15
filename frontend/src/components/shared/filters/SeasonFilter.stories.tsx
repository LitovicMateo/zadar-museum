import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import SeasonFilter from './SeasonFilter';

const meta = {
	title: 'Filters/SeasonFilter',
	component: SeasonFilter,
	tags: ['autodocs'],
	argTypes: {
		season: { control: 'text' },
		seasons: { control: 'object' }
	},
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof SeasonFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const seasons = ['2023/2024', '2022/2023', '2021/2022', '2020/2021', '2019/2020'];

export const AllSelected: Story = {
	args: { seasons, season: 'all', onSeasonChange: () => {} },
	render: (args) => {
		const [season, setSeason] = useState(args.season ?? 'all');
		return <SeasonFilter seasons={args.seasons} season={season} onSeasonChange={setSeason} />;
	}
};

export const SpecificSeason: Story = {
	args: { seasons, season: '2023/2024', onSeasonChange: () => {} },
	render: (args) => {
		const [season, setSeason] = useState(args.season ?? 'all');
		return <SeasonFilter seasons={args.seasons} season={season} onSeasonChange={setSeason} />;
	}
};

export const FewSeasons: Story = {
	args: { seasons: ['2023/2024', '2022/2023'], season: 'all', onSeasonChange: () => {} },
	render: (args) => {
		const [season, setSeason] = useState(args.season ?? 'all');
		return <SeasonFilter seasons={args.seasons} season={season} onSeasonChange={setSeason} />;
	}
};

export const ManySeasons: Story = {
	args: {
		seasons: [
			'2023/2024', '2022/2023', '2021/2022', '2020/2021', '2019/2020',
			'2018/2019', '2017/2018', '2016/2017', '2015/2016', '2014/2015'
		],
		season: 'all',
		onSeasonChange: () => {}
	},
	render: (args) => {
		const [season, setSeason] = useState(args.season ?? 'all');
		return <SeasonFilter seasons={args.seasons} season={season} onSeasonChange={setSeason} />;
	}
};
