import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import RefereeForm from '@/components/forms/referee/RefereeForm';
import { useRefereeDetails } from '@/hooks/queries/referee/useRefereeDetails';
import { useReferees } from '@/hooks/queries/referee/useReferees';
import { RefereeFormData } from '@/schemas/referee-schema';
import { updateReferee } from '@/services/referees/updateReferee';
import { useMutation } from '@tanstack/react-query';

const EditReferee = () => {
	const [refereeId, setRefereeId] = React.useState<string>('');

	const { data: referees } = useReferees('createdAt', 'desc');
	const { data: referee } = useRefereeDetails(refereeId);

	const mutation = useMutation({
		mutationFn: updateReferee,
		onError(error) {
			toast.error(`Error updating referee: ${error.message}`);
		},

		onSuccess: () => {
			toast.success(`Referee updated successfully`, {
				duration: 3000
			});
		}
	});
	const handleSubmit = (data: RefereeFormData) => {
		mutation.mutate({ ...data, id: refereeId });
	};
	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={referees?.map((coach) => ({
						label: `${coach.first_name} ${coach.last_name}`,
						value: coach.documentId
					}))}
					onChange={(e) => setRefereeId(e!.value.toString())}
					isSearchable
				/>
			</div>
			{referee && (
				<RefereeForm
					referee={referee}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						first_name: referee.first_name,
						last_name: referee.last_name,
						nationality: referee.nationality
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditReferee;
