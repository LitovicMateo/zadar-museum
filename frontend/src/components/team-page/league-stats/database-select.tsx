import React from 'react';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away'>>;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({ selected, setSelected }) => {
	return (
		<fieldset className="flex flex-row gap-4 font-abel">
			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="total"
					checked={selected === 'total'}
					onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
				/>
				Total
			</label>

			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="home"
					checked={selected === 'home'}
					onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
				/>
				Home
			</label>

			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="away"
					checked={selected === 'away'}
					onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
				/>
				Away
			</label>
		</fieldset>
	);
};

export default DatabaseSelect;
