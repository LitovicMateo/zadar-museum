import React from 'react';

import Heading from './Heading';

import styles from '@/components/UI/Fieldset.module.css';

type FieldsetProps = {
	children?: React.ReactNode;
	label: string;
};

const Fieldset: React.FC<FieldsetProps> = ({ children, label }) => {
	return (
		<fieldset className={styles.fieldset}>
			<Heading title={label} type="secondary" />
			<div className={styles.body}>{children}</div>
		</fieldset>
	);
};

export default Fieldset;
