import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import TeamForm from '@/components/forms/team/TeamForm';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { useTeams } from '@/hooks/queries/team/useTeams';
import { TeamFormData } from '@/schemas/team-schema';
import { updateTeam } from '@/services/teams/updateTeam';
import { useMutation } from '@tanstack/react-query';

const EditTeam: React.FC = () => {
	const [teamSlug, setTeamSlug] = React.useState<string>('');

	const { data: teams } = useTeams('slug', 'asc');
	const { data: team } = useTeamDetails(teamSlug);

	const mutation = useMutation({
		mutationFn: updateTeam,
		onError(error) {
			toast.error(`Error updating team: ${error.message}`);
		},
		onSuccess() {
			toast.success('Team updated successfully');
		}
	});

	const handleSubmit = (data: TeamFormData) => {
		mutation.mutate({ ...data, id: team!.documentId });
	};

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={teams?.map((team) => ({
						label: team?.name,
						value: team.slug
					}))}
					onChange={(e) => setTeamSlug(e!.value.toString())}
					isSearchable
				/>
			</div>
			{team && (
				<TeamForm
					team={team}
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						name: team.name,
						alternate_names: team.alternate_names,
						short_name: team.short_name,
						city: team.city,
						country: team.country,
						image: team.image
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditTeam;
