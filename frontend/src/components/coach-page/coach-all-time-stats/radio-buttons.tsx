import React from 'react';

import { View } from './coach-all-time-stats';

type RadioButtonsProps = { view: View; setView: React.Dispatch<React.SetStateAction<View>> };

const RadioButtons: React.FC<RadioButtonsProps> = ({ view, setView }) => {
	return (
		<fieldset className="flex flex-row gap-4 font-abel">
			<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
				<input
					type="radio"
					name="view"
					value="allTime"
					checked={view === 'allTime'}
					onChange={(e) => setView(e.target.value as View)}
					className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
				/>
				All
			</label>

			<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
				<input
					type="radio"
					name="view"
					value="headCoach"
					checked={view === 'headCoach'}
					onChange={(e) => setView(e.target.value as View)}
					className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
				/>
				Head Coach
			</label>

			<label className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
				<input
					type="radio"
					name="view"
					value="assistantCoach"
					checked={view === 'assistantCoach'}
					onChange={(e) => setView(e.target.value as View)}
					className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
				/>
				Assistant Coach
			</label>
		</fieldset>
	);
};

export default RadioButtons;
