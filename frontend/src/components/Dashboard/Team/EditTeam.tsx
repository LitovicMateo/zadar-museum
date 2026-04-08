import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import TeamForm from '@/components/forms/team/TeamForm';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { TeamFormData } from '@/schemas/TeamSchema';
import { updateTeam } from '@/services/teams/UpdateTeam';
import { useMutation } from '@tanstack/react-query';

import styles from '@/components/Dashboard/shared/EditPage.module.css';

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
			<div className={styles.selectWrap}>
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
