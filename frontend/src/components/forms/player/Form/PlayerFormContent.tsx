import React from 'react';
import { useFormContext } from 'react-hook-form';

import FormCard from '@/components/forms/shared/FormCard';
import SubmitButton from '@/components/UI/SubmitButton';
import { PlayerFormData } from '@/schemas/PlayerSchema';

import ProfileImage from '../../coach/Fields/ProfileImage';
import ProfileImagePreview from '../../coach/Fields/ProfileImagePreview';
import ActivePlayer from '../Fields/ActivePlayer';
import DateOfBirth from '../Fields/DateOfBirth';
import DateOfDeath from '../Fields/DateOfDeath';
import FirstName from '../Fields/FirstName';
import Height from '../Fields/Height';
import LastName from '../Fields/LastName';
import Nationality from '../Fields/Nationality';
import PrimaryPosition from '../Fields/PrimaryPosition';
import { SecondaryPosition } from '../Fields/SecondaryPosition';

type PlayerFormContentProps = {
	mode: 'create' | 'edit';
};

const PlayerFormContent: React.FC<PlayerFormContentProps> = ({ mode }) => {
	const { formState } = useFormContext<PlayerFormData>();

	const [preview, setPreview] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,1fr)_1fr] gap-2 items-start">
				<div className="flex flex-col gap-2">
					<FormCard label="Player Bio">
						<FirstName />
						<LastName />
						<Height />
						<DateOfBirth />
						<DateOfDeath />
						<Nationality />
						<ActivePlayer />
					</FormCard>
					<FormCard label="Positions">
						<PrimaryPosition />
						<SecondaryPosition />
					</FormCard>
				</div>
				<div className="flex flex-col gap-2">
					<FormCard label="Profile Picture">
						<ProfileImage fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
					<FormCard label="Picture Preview">
						<ProfileImagePreview fileInputRef={fileInputRef} preview={preview} setPreview={setPreview} />
					</FormCard>
				</div>
			</div>
			<div className="flex justify-center">
				<SubmitButton
					isSubmitting={formState.isSubmitting}
					label={mode === 'edit' ? 'Update Player' : 'Create Player'}
				/>
			</div>
		</div>
	);
};

export default PlayerFormContent;
