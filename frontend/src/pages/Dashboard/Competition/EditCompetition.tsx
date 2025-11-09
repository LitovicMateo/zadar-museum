import React from 'react';
import { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import CompetitionForm from '@/components/forms/competition/CompetitionForm';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { CompetitionFormData } from '@/schemas/competition-schema';
import { updateCompetition } from '@/services/competitions/updateCompetition';
import { useMutation } from '@tanstack/react-query';

const EditCompetition = () => {
	const [competitionSlug, setCompetitionSlug] = React.useState('');

	const { data: competitions } = useCompetitions('slug', 'asc');
	const { data: competition } = useLeagueDetails(competitionSlug);

	const mutation = useMutation({
		mutationFn: updateCompetition,
		onError(error) {
			console.error('Error updating competition', error.message);
		}
	});

	const handleSubmit = (data: CompetitionFormData) => {
		mutation.mutate({ ...data, id: competition!.documentId });
	};

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={competitions?.map((competition) => ({
						label: competition.name,
						value: competition.slug
					}))}
					onChange={(e) => setCompetitionSlug(e!.value.toString())}
					isSearchable
				/>
			</div>
			{competition && (
				<CompetitionForm
					competition={competition}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						name: competition.name,
						short_name: competition.short_name,
						alternate_names: competition.alternate_names,
						trophies: competition.trophies
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditCompetition;
