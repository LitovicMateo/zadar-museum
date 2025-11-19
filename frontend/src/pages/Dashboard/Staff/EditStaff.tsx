import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

import StaffForm from '@/components/forms/staff/StaffForm';
import { useStaffDetails } from '@/hooks/queries/staff/useStaffDetails';
import { useStaffs } from '@/hooks/queries/staff/useStaffs';
import { StaffFormData } from '@/schemas/staff-schema';
import { updateStaff } from '@/services/staff/updateStaff';
import { useMutation } from '@tanstack/react-query';

const EditStaff: React.FC = () => {
	const [staffId, setStaffId] = React.useState<string>('');

	const { data: staffs } = useStaffs('createdAt', 'desc');
	const { data: staff } = useStaffDetails(staffId);

	const mutation = useMutation({
		mutationFn: updateStaff,
		onError(error: Error) {
			toast.error(`Error updating staff: ${error.message}`);
		},
		onSuccess: () => {
			toast.success(`Staff updated successfully`, {
				duration: 3000
			});
		}
	});

	const handleSubmit = (data: StaffFormData) => {
		mutation.mutate({ ...data, id: staffId });
	};

	return (
		<div>
			<div className="max-w-[200px] w-full py-4">
				<Select
					options={staffs?.map((s) => ({ label: `${s.first_name} ${s.last_name}`, value: s.documentId }))}
					onChange={(e) => setStaffId(e!.value.toString())}
					isSearchable
				/>
			</div>
			{staff && (
				<StaffForm
					onSubmit={handleSubmit}
					mode="edit"
					defaultValues={{
						first_name: staff.first_name,
						last_name: staff.last_name,
						role: staff.role as StaffFormData['role']
					}}
				/>
			)}
			<Toaster position="bottom-right" />
		</div>
	);
};

export default EditStaff;
