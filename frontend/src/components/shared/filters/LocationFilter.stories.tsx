import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import LocationFilter from './LocationFilter';

type LocationValue = 'home' | 'away' | 'all';

const meta = {
	title: 'Filters/LocationFilter',
	component: LocationFilter,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded'
	}
} satisfies Meta<typeof LocationFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLocations: Story = {
	render: () => {
		const [location, setLocation] = useState<LocationValue>('all');
		return <LocationFilter location={location} setLocation={setLocation} />;
	}
};

export const HomeSelected: Story = {
	render: () => {
		const [location, setLocation] = useState<LocationValue>('home');
		return <LocationFilter location={location} setLocation={setLocation} />;
	}
};

export const AwaySelected: Story = {
	render: () => {
		const [location, setLocation] = useState<LocationValue>('away');
		return <LocationFilter location={location} setLocation={setLocation} />;
	}
};
