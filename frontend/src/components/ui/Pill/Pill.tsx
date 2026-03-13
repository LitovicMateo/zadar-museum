import styles from './Pill.module.css';

function Pill({
	label,
	isDisabled,
	isActive,
	...props
}: { label: string; isDisabled: boolean; isActive: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			role="radio"
			className={[styles.pill, isActive ? styles.pillActive : '', isDisabled ? styles.pillDisabled : '']
				.filter(Boolean)
				.join(' ')}
			{...props}
		>
			{label}
		</button>
	);
}

export default Pill;
