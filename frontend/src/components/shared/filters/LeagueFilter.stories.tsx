import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import LeagueFilter from './LeagueFilter';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

const meta = {
	title: 'Filters/LeagueFilter',
	component: LeagueFilter,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof LeagueFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const competitions = [
	{ slug: 'hnl', name: 'HNL', id: 1 },
	{ slug: 'kup', name: 'Hrvatski kup', id: 2 },
	{ slug: 'eurocup', name: 'EuroCup', id: 3 },
	{ slug: 'champions-league', name: 'Champions League', id: 4 }
] as unknown as CompetitionDetailsResponse[];

export const AllLeagues: Story = {
	args: { league: 'all', setLeague: () => {}, competitions },
	render: (args) => {
		const [league, setLeague] = useState(args.league);
		return <LeagueFilter league={league} setLeague={setLeague} competitions={args.competitions} />;
	}
};

export const SpecificLeague: Story = {
	args: { league: 'hnl', setLeague: () => {}, competitions },
	render: (args) => {
		const [league, setLeague] = useState(args.league);
		return <LeagueFilter league={league} setLeague={setLeague} competitions={args.competitions} />;
	}
};

export const SingleCompetition: Story = {
	args: {
		league: 'all',
		setLeague: () => {},
		competitions: [{ slug: 'hnl', name: 'HNL', id: 1 } as unknown as CompetitionDetailsResponse]
	},
	render: (args) => {
		const [league, setLeague] = useState(args.league);
		return <LeagueFilter league={league} setLeague={setLeague} competitions={args.competitions} />;
	}
};

export const ManyCompetitions: Story = {
	args: {
		league: 'all',
		setLeague: () => {},
		competitions: Array.from({ length: 8 }, (_, i) => ({
			slug: `league-${i + 1}`,
			name: `League ${i + 1}`,
			id: i + 1
		})) as unknown as CompetitionDetailsResponse[]
	},
	render: (args) => {
		const [league, setLeague] = useState(args.league);
		return <LeagueFilter league={league} setLeague={setLeague} competitions={args.competitions} />;
	}
};
