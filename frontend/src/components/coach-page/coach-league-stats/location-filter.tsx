import React from 'react';

type LocationFilterProps = {
	location: 'total' | 'home' | 'away';
	setLocation: (location: 'total' | 'home' | 'away') => void;
};

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation }) => {
	return (
		<div>
			<p className="font-semibold mb-1">Location</p>
			<fieldset className="flex flex-row gap-4 font-abel">
				<label className="flex gap-2">
					<input
						type="radio"
						value="total"
						checked={location === 'total'}
						onChange={() => setLocation('total')}
					/>
					Total
				</label>
				<label className="flex gap-2">
					<input
						type="radio"
						value="home"
						checked={location === 'home'}
						onChange={() => setLocation('home')}
					/>
					Home
				</label>
				<label className="flex gap-2">
					<input
						type="radio"
						value="away"
						checked={location === 'away'}
						onChange={() => setLocation('away')}
					/>
					Away
				</label>
			</fieldset>
		</div>
	);
};

export default LocationFilter;
