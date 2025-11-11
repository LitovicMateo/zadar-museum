import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'react-slugify';

import NoContent from '@/components/no-content/no-content';
import { APP_ROUTES } from '@/constants/routes';
import { useStaffs } from '@/hooks/queries/staff/useStaffs';
import { useSearch } from '@/hooks/useSearch';

const StaffsPage: React.FC = () => {
	const { data: staffs } = useStaffs('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!staffs) return null;
	if (staffs && staffs.length === 0) return <NoContent>No staff in database.</NoContent>;

	const filtered = staffs.filter((s) => {
		const name = slugify(`${s.first_name} ${s.last_name}`, { delimiter: ' ' });
		if (!searchTerm) return true;
		return name.includes(searchTerm);
	});

	return (
		<div>
			{SearchInput}
			<ul>
				{filtered.map((staff) => (
					<li key={staff.id}>
						<Link to={APP_ROUTES.staff(staff.documentId)}>
							{staff.first_name} {staff.last_name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default StaffsPage;
