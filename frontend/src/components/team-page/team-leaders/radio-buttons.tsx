import React from 'react';

type RadioButtonsProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, setSelected }) => {
	return (
		<form action="">
			<fieldset className="flex flex-row gap-3 font-abel">
				<label className="flex items-center gap-2 cursor-pointer group">
					<div className="relative flex items-center justify-center">
						<input
							type="radio"
							name="player"
							value={'player'}
							checked={selected === 'player'}
							onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
							className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
						/>
					</div>
					<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
						Player
					</span>
				</label>
				<label className="flex items-center gap-2 cursor-pointer group">
					<div className="relative flex items-center justify-center">
						<input
							type="radio"
							name="coach"
							value={'coach'}
							checked={selected === 'coach'}
							onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
							className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
						/>
					</div>
					<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
						Coach
					</span>
				</label>
			</fieldset>
		</form>
	);
};

export default RadioButtons;
