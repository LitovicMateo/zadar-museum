import React from 'react';

type Props = {
	label: React.ReactNode;
	value: React.ReactNode;
	header?: boolean;
};

const VenueStatRow: React.FC<Props> = ({ label, value, header = false }) => {
	if (header) {
		return (
			<li className="px-4 py-3 bg-slate-50 border-b border-gray-200 text-sm font-semibold tracking-wide text-gray-700">
				<div className="flex items-center justify-between">
					<span>{label}</span>
					<span>{value}</span>
				</div>
			</li>
		);
	}

	return (
		<li>
			<div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-sm text-gray-700">
				<div className="text-gray-700">{label}</div>
				<div className="font-medium text-gray-900">{value}</div>
			</div>
		</li>
	);
};

export default VenueStatRow;
