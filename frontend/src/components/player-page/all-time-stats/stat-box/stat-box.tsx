import React from 'react';

type StatBoxProps = {
	label: string;
	stat: number;
	rank?: number;
};
const StatBox: React.FC<StatBoxProps> = ({ label, rank, stat }) => {
	return (
		<div className="relative h-[200px] w-[200px] flex flex-col rounded-sm overflow-hidden border-2 border-[#174D93]">
			<div className="h-full w-full flex justify-center items-center bg-white text-6xl">{stat}</div>
			<div className="flex items-center h-fit w-full justify-center bg-[#174D93] p-3">
				<span className="uppercase font-bold text-base text-white">{label}</span>
			</div>
			{rank && (
				<div className="absolute w-[32px] aspect-square rounded-full flex justify-center items-center top-[-8px] right-[-8px] border-1 border-solid border-gray-500 bg-gradient-to-br from-white to-blue-50 text-md font-bold font-mono">
					<span>{rank}</span>
				</div>
			)}
		</div>
	);
};

export default StatBox;
