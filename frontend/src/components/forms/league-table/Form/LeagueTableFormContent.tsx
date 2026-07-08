import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';

import Competition from '../Fields/Competition';
import Season from '../Fields/Season';
import Stage from '../Fields/Stage';
import Standings from '../Fields/Standings';

type LeagueTableFormContentProps = {
	mode: 'create' | 'edit';
};

const LeagueTableFormContent: React.FC<LeagueTableFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<LeagueTableFormData>();

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
			<FormCard label="Competition & Stage">
				<Season />
				<Competition />
				<Stage />
			</FormCard>

			<FormCard label="Final Standings">
				<Standings />
			</FormCard>

			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update League Table' : 'Create League Table'}
				/>
			</div>
		</div>
	);
};

export default LeagueTableFormContent;
