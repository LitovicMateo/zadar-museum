import React from 'react';

type LocationFilterProps = {
	location: 'total' | 'home' | 'away';
	setLocation: (location: 'total' | 'home' | 'away') => void;
};

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation }) => {
	const id = React.useId();

	return (
		<div>
			<p className="font-semibold mb-1">Location</p>
			<fieldset aria-label="Location" className="flex flex-row gap-4 font-abel">
				<legend className="sr-only">Location</legend>
				<label htmlFor={`${id}-total`} className="flex gap-2">
					<input
						id={`${id}-total`}
						type="radio"
						name={`location-${id}`}
						value="total"
						checked={location === 'total'}
						onChange={() => setLocation('total')}
					/>
					Total
				</label>
				<label htmlFor={`${id}-home`} className="flex gap-2">
					<input
						id={`${id}-home`}
						type="radio"
						name={`location-${id}`}
						value="home"
						checked={location === 'home'}
						onChange={() => setLocation('home')}
					/>
					Home
				</label>
				<label htmlFor={`${id}-away`} className="flex gap-2">
					<input
						id={`${id}-away`}
						type="radio"
						name={`location-${id}`}
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

export default React.memo(LocationFilter);
