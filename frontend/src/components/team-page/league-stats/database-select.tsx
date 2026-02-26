import React from 'react';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away'>>;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({ selected, setSelected }) => {
	return (
		<fieldset className="flex flex-row gap-3 font-abel">
			<label className="flex items-center gap-2 cursor-pointer group">
				<div className="relative flex items-center justify-center">
					<input
						type="radio"
						name="view"
						value="total"
						checked={selected === 'total'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
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
						value="home"
						checked={selected === 'home'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
						className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
					/>
				</div>
				<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
					Home
				</span>
			</label>

			<label className="flex items-center gap-2 cursor-pointer group">
				<div className="relative flex items-center justify-center">
					<input
						type="radio"
						name="view"
						value="away"
						checked={selected === 'away'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
						className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
					/>
				</div>
				<span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
					Away
				</span>
			</label>
		</fieldset>
	);
};

export default DatabaseSelect;
