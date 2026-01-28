import React from 'react';

type Buttons = {
	selected: 'total' | 'average';
	setSelected: (view: 'total' | 'average') => void;
};

const Buttons: React.FC<Buttons> = ({ selected, setSelected }) => {
	return (
		<fieldset className="flex flex-row gap-3 font-abel">
			<label className="flex items-center gap-2 cursor-pointer group">
				<div className="relative flex items-center justify-center">
					<input
						type="radio"
						name="view"
						value="total"
						checked={selected === 'total'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
						className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
					/>
				</div>
				<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
					Total
				</span>
			</label>

			<label className="flex items-center gap-2 cursor-pointer group">
				<div className="relative flex items-center justify-center">
					<input
						type="radio"
						name="view"
						value="average"
						checked={selected === 'average'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
						className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
					/>
				</div>
				<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
					Average
				</span>
			</label>
		</fieldset>
	);
};

export default Buttons;
