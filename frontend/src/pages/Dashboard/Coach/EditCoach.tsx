import React from 'react';
import { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import CoachForm from '@/components/forms/coach/CoachForm';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import { CoachFormData } from '@/schemas/coach-schema';
import { updateCoach } from '@/services/coaches/updateCoach';
import { useMutation } from '@tanstack/react-query';

const EditCoach = () => {
	const [coachId, setCoachId] = React.useState<string>('');

	const { data: coaches } = useCoaches('createdAt', 'desc');
	const { data: coach } = useCoachDetails(coachId);

	const mutation = useMutation({
		mutationFn: updateCoach,
		onError(error) {
			console.error('Error updating coach', error.message);
		}
	});

	const handleSubmit = (data: CoachFormData) => {
		mutation.mutate({ ...data, id: coachId });
	};

	console.table(coach);

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={coaches?.map((coach) => ({
						label: `${coach.first_name} ${coach.last_name}`,
						value: coach.documentId
					}))}
					onChange={(e) => setCoachId(e!.value.toString())}
					isSearchable
				/>
			</div>
			{coach && (
				<CoachForm
					coach={coach}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						first_name: coach.first_name,
						last_name: coach.last_name,
						date_of_birth: coach.date_of_birth || null,
						image: coach.image || null,
						nationality: coach.nationality
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditCoach;
