import React from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { VenueFormData, venueSchema } from '@/schemas/venue-schema';
import { VenueDetailsResponse } from '@/types/api/venue';
import { zodResolver } from '@hookform/resolvers/zod';

type VenueFormProviderProps = {
	children?: React.ReactNode;
	onSubmit: (data: VenueFormData) => void;
	defaultValues: VenueFormData;
	venue?: VenueDetailsResponse;
	isSuccess?: boolean;
};

const VenueFormProvider: React.FC<VenueFormProviderProps> = ({
	children,
	onSubmit,
	defaultValues,
	venue,
	isSuccess
}) => {
	const methods = useForm<VenueFormData>({
		resolver: zodResolver(venueSchema),
		defaultValues
	});

	const handleErrors = (errors: FieldErrors<VenueFormData>) => {
		Object.entries(errors).forEach(([key, value]) => {
			const keyFormatted = key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1);
			if (value) {
				toast.error(`${keyFormatted}: ${value.message}`);
			}
		});
	};

	const { reset } = methods;

	React.useEffect(() => {
		if (venue) {
			reset({
				city: venue.city,
				country: venue.country,
				name: venue.name
			});
		}
	}, [venue, reset]);

	React.useEffect(() => {
		if (isSuccess) {
			reset(defaultValues);
			methods.setFocus('name');
		}
	}, [isSuccess, methods, defaultValues, reset]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, handleErrors)}>{children}</form>
		</FormProvider>
	);
};

export default VenueFormProvider;
