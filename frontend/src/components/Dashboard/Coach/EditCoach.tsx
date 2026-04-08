import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import CoachForm from '@/components/forms/coach/CoachForm';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';
import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { CoachFormData } from '@/schemas/CoachSchema';
import { updateCoach } from '@/services/coaches/UpdateCoach';
import { useMutation } from '@tanstack/react-query';

import styles from '@/components/Dashboard/shared/EditPage.module.css';

const EditCoach = () => {
	const [coachId, setCoachId] = React.useState<string>('');

	const { data: coaches } = useCoaches('createdAt', 'desc');
	const { data: coach } = useCoachDetails(coachId);

	const mutation = useMutation({
		mutationFn: updateCoach,
		onError(error) {
			toast.error(`Error updating coach: ${error.message}`);
		},
		onSuccess() {
			toast.success('Coach updated successfully');
		}
	});

	const handleSubmit = (data: CoachFormData) => {
		mutation.mutate({ ...data, id: coachId });
	};

	return (
		<div>
			<div className={styles.selectWrap}>
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
