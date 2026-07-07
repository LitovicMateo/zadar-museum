import React from 'react';

import FormWrapper from '@/components/UI/FormWrapper';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';
import { LeagueTableRecord } from '@/types/api/LeagueTable';

import LeagueTableFormContent from './Form/LeagueTableFormContent';
import LeagueTableFormProvider from './Form/LeagueTableFormProvider';

type LeagueTableFormProps = {
	onSubmit: (data: LeagueTableFormData) => void;
	defaultValues?: LeagueTableFormData;
	mode: 'create' | 'edit';
	record?: LeagueTableRecord;
	isSuccess?: boolean;
};

const emptyDefaults: LeagueTableFormData = {
	season: '',
	competition: '',
	stageNumber: '',
	stageName: '',
	standings: [
		{
			team: '',
			teamName: '',
			teamShortName: '',
			gamesPlayed: '',
			wins: '',
			draws: '',
			losses: '',
			pointsDiff: '',
			points: ''
		}
	]
};

const LeagueTableForm: React.FC<LeagueTableFormProps> = ({
	onSubmit,
	defaultValues = emptyDefaults,
	mode,
	record,
	isSuccess
}) => {
	return (
		<FormWrapper>
			<LeagueTableFormProvider
				onSubmit={onSubmit}
				defaultValues={defaultValues}
				record={record}
				isSuccess={isSuccess}
				mode={mode}
			>
				<LeagueTableFormContent mode={mode} />
			</LeagueTableFormProvider>
		</FormWrapper>
	);
};

export default LeagueTableForm;
