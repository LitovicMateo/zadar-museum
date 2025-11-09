import React from 'react';

type RadioButtonsProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, setSelected }) => {
	return (
		<form action="">
			<fieldset className="flex flex-row gap-4 font-abel">
				<label htmlFor="" className="flex gap-2">
					<input
						type="radio"
						name="player"
						value={'player'}
						checked={selected === 'player'}
						onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
					/>
					Player
				</label>
				<label htmlFor="" className="flex gap-2">
					<input
						type="radio"
						name="coach"
						value={'coach'}
						checked={selected === 'coach'}
						onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
					/>
					Coach
				</label>
			</fieldset>
		</form>
	);
};

export default RadioButtons;
