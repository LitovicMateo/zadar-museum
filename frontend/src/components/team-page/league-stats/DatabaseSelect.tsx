import React from 'react';
import styles from './DatabaseSelect.module.css';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away'>>;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({ selected, setSelected }) => {
	return (
		<fieldset className={styles.fieldset}>
			<label className={styles.label}>
				<div className={styles.radioWrap}>
					<input
						type="radio"
						name="view"
						value="total"
						checked={selected === 'total'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
						className={styles.input}
					/>
				</div>
				<span className={styles.labelText}>
					Total
				</span>
			</label>

			<label className={styles.label}>
				<div className={styles.radioWrap}>
					<input
						type="radio"
						name="view"
						value="home"
						checked={selected === 'home'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
						className={styles.input}
					/>
				</div>
				<span className={styles.labelText}>
					Home
				</span>
			</label>

			<label className={styles.label}>
				<div className={styles.radioWrap}>
					<input
						type="radio"
						name="view"
						value="away"
						checked={selected === 'away'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'home' | 'away')}
						className={styles.input}
					/>
				</div>
				<span className={styles.labelText}>
					Away
				</span>
			</label>
		</fieldset>
	);
};

export default DatabaseSelect;
