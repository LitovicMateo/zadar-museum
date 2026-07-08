import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import LeagueTableForm from '@/components/forms/league-table/LeagueTableForm';
import { buildLeagueTableDefaults } from '@/components/forms/league-table/Form/buildLeagueTableDefaults';
import FormPageLayout from '@/layouts/FormPageLayout';
import { useLeagueTableById } from '@/hooks/queries/league-table/UseLeagueTableById';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';
import { createLeagueTable } from '@/services/league-table/CreateLeagueTable';
import { updateLeagueTable } from '@/services/league-table/UpdateLeagueTable';

const LeagueTableFormPage: React.FC = () => {
	const { id: documentId } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const mode = documentId ? 'edit' : 'create';

	const { data: record } = useLeagueTableById(documentId ?? '');

	const mutation = useMutation({
		mutationFn: (data: LeagueTableFormData) =>
			documentId ? updateLeagueTable({ ...data, id: documentId }) : createLeagueTable(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['league-table'] });
			toast.success(
				mode === 'create' ? 'League table created successfully' : 'League table updated successfully'
			);
		},
		onError: (error: Error) => {
			toast.error(`Error: ${error.message}`);
		}
	});

	if (mode === 'edit' && !record) {
		return <FormPageLayout>{null}</FormPageLayout>;
	}

	const defaultValues: LeagueTableFormData | undefined = record
		? buildLeagueTableDefaults(record)
		: undefined;

	return (
		<FormPageLayout>
			<LeagueTableForm
				record={record}
				onSubmit={(data) => mutation.mutate(data)}
				mode={mode}
				defaultValues={defaultValues}
				isSuccess={mutation.isSuccess}
			/>
			<Toaster position="bottom-right" />
		</FormPageLayout>
	);
};

export default LeagueTableFormPage;
