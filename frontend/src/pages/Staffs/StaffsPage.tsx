import React from 'react';
import { Link } from 'react-router-dom';
import slugify from 'react-slugify';

import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useSearch } from '@/hooks/UseSearch';
import { useStaffs } from '@/hooks/queries/staff/UseStaffs';

const StaffsPage: React.FC = () => {
	const { data: staffs } = useStaffs('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!staffs) return null;
	if (staffs && staffs.length === 0) return <NoContent type="info" description="No staff in database." />;

	const filtered = staffs.filter((s) => {
		const name = slugify(`${s.first_name} ${s.last_name}`, { delimiter: ' ' });
		if (!searchTerm) return true;
		return name.includes(searchTerm);
	});

	return (
		<div>
			{SearchInput}
			<DynamicContentWrapper>
				<ul>
					{filtered.map((staff) => (
						<li key={staff.id}>
							<Link to={APP_ROUTES.staff(staff.documentId)}>
								{staff.first_name} {staff.last_name}
							</Link>
						</li>
					))}
				</ul>
			</DynamicContentWrapper>
		</div>
	);
};

export default StaffsPage;
