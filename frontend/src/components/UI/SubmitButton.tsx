import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/Utils';
import styles from './SubmitButton.module.css';

import Button from './Button';

type SubmitButtonProps = {
	isSubmitting: boolean;
	label: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
	return (
		<div className={styles.wrapper}>
			<Button
				type="submit"
				disabled={isSubmitting}
				variant="default"
				size="lg"
				className={cn(styles.button)}
				data-slot="submit-button"
			>
				{isSubmitting ? (
					<>
						<Loader2 size={15} className="animate-spin" />
						Submitting…
					</>
				) : label}
			</Button>
		</div>
	);
};

export default SubmitButton;
