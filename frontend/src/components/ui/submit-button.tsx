import React from 'react';

import Button from './button';

type SubmitButtonProps = {
	isSubmitting: boolean;
	label: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
	return (
		<div className="w-full flex justify-center">
			<Button
				type="submit"
				disabled={isSubmitting}
				variant="secondary"
				size="default"
				className="w-full max-w-[250px]"
				data-slot="submit-button"
			>
				{isSubmitting ? 'Submitting...' : label}
			</Button>
		</div>
	);
};

export default SubmitButton;
