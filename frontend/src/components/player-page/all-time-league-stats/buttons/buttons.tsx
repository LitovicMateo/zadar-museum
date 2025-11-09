import React from 'react';

type Buttons = {
	selected: 'total' | 'average';
	setSelected: (view: 'total' | 'average') => void;
};

const Buttons: React.FC<Buttons> = ({ selected, setSelected }) => {
	return (
		<fieldset className="flex flex-row gap-4 font-abel">
			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="total"
					checked={selected === 'total'}
					onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
				/>
				Total
			</label>

			<label className="flex gap-2">
				<input
					type="radio"
					name="view"
					value="average"
					checked={selected === 'average'}
					onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
				/>
				Average
			</label>
		</fieldset>
	);
};

export default Buttons;
