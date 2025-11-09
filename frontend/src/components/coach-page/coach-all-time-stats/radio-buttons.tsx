import React from 'react';

import { View } from './coach-all-time-stats';

type RadioButtonsProps = { view: View; setView: React.Dispatch<React.SetStateAction<View>> };

const RadioButtons: React.FC<RadioButtonsProps> = ({ view, setView }) => {
	return (
		<fieldset className="flex flex-row gap-4 font-abel">
			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="allTime"
					checked={view === 'allTime'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				All
			</label>

			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="headCoach"
					checked={view === 'headCoach'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				Head Coach
			</label>

			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="assistantCoach"
					checked={view === 'assistantCoach'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				Assistant Coach
			</label>
		</fieldset>
	);
};

export default RadioButtons;
