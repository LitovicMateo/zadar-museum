import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { GameFormData } from '@/schemas/game-schema';

const ForfeitedBy: React.FC = () => {
	const { register, watch, setValue } = useFormContext<GameFormData>();

	const isForteited = watch('forfeited');

	useEffect(() => {
		if (!isForteited) {
			setValue('forfeited_by', 'none');
		}
	}, [isForteited, setValue]);
	return (
		<div className={`space-y-2 text-xs ${!isForteited ? 'text-gray-400 cursor-not-allowed' : ''}`}>
			<div className="flex items-center space-x-4">
				<label
					className={`flex items-center space-x-2 whitespace-nowrap ${!isForteited ? 'cursor-not-allowed' : ''}`}
				>
					<Input
						type="radio"
						value="home"
						{...register('forfeited_by')}
						className="accent-blue-600"
						disabled={!isForteited}
					/>
					<span>Home Team</span>
				</label>

				<label
					className={`flex items-center space-x-2 whitespace-nowrap ${!isForteited ? 'cursor-not-allowed' : ''}`}
				>
					<Input
						type="radio"
						value="away"
						{...register('forfeited_by')}
						className={`accent-blue-600 ${!isForteited ? 'cursor-not-allowed' : ''}`}
						disabled={!isForteited}
					/>
					<span>Away Team</span>
				</label>
			</div>
		</div>
	);
};

export default ForfeitedBy;
