import styles from './RadioGroup.module.css';

function RadioGroup({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.controlBox}>
			<fieldset className={styles.container}>{children}</fieldset>
		</div>
	);
}

export default RadioGroup;
