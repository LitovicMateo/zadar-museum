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
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="total"
						checked={location === 'total'}
						onChange={() => setLocation('total')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Total
				</label>
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="home"
						checked={location === 'home'}
						onChange={() => setLocation('home')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Home
				</label>
				<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
					<input
						type="radio"
						value="away"
						checked={location === 'away'}
						onChange={() => setLocation('away')}
						className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
					/>
					Away
				</label>
			</fieldset>
		</div>
	);
};

export default LocationFilter;
