import React from 'react';

import Button from './button';

type SubmitButtonProps = {
	isSubmitting: boolean;
	label: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
	const classes = `text-gray-700 bg-green-200! hover:bg-green-300! cursor-pointer border border-solid border-green-400 w-full max-w-[250px]`;

	return (
		<div className="w-full flex justify-center">
			<Button
				type="submit"
				disabled={isSubmitting}
				className={classes}
				data-slot="submit-button"
				// Inline fallback in case utilities aren't applied correctly in the build
				style={!isSubmitting ? { backgroundColor: '#bbf7d0' } : undefined}
			>
				{isSubmitting ? 'Submitting...' : label}
			</Button>
		</div>
	);
};

export default SubmitButton;
