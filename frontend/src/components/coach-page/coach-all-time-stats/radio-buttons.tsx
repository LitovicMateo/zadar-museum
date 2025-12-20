import React from 'react';

import { View } from './coach-all-time-stats';

type RadioButtonsProps = { view: View; setView: React.Dispatch<React.SetStateAction<View>> };

const RadioButtons: React.FC<RadioButtonsProps> = ({ view, setView }) => {
	const id = React.useId();

	return (
		<fieldset className="flex flex-row gap-4 font-abel" aria-label="All-time view selector">
			<legend className="sr-only">View</legend>

			<label htmlFor={`${id}-all`} className="flex gap-2">
				<input
					id={`${id}-all`}
					type="radio"
					name={`view-${id}`}
					value="allTime"
					checked={view === 'allTime'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				All
			</label>

			<label htmlFor={`${id}-head`} className="flex gap-2">
				<input
					id={`${id}-head`}
					type="radio"
					name={`view-${id}`}
					value="headCoach"
					checked={view === 'headCoach'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				Head Coach
			</label>

			<label htmlFor={`${id}-assistant`} className="flex gap-2">
				<input
					id={`${id}-assistant`}
					type="radio"
					name={`view-${id}`}
					value="assistantCoach"
					checked={view === 'assistantCoach'}
					onChange={(e) => setView(e.target.value as View)}
				/>
				Assistant Coach
			</label>
		</fieldset>
	);
};

export default React.memo(RadioButtons);
