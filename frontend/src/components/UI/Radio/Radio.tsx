import styles from './Radio.module.css';

function Radio({
	label,
	isActive,
	isDisabled,
	...props
}: { label: string; isActive: boolean; isDisabled?: boolean } & React.HTMLAttributes<HTMLInputElement>) {
	return (
		<label className={[styles.radioLabel, isDisabled ? styles.radioLabelDisabled : ''].join(' ')}>
			<input
				type="radio"
				value={label}
				checked={isActive}
				disabled={isDisabled}
				className={styles.radio}
				{...props}
			/>
			<span>{label}</span>
		</label>
	);
}

export default Radio;
