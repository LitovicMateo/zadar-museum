import React from 'react';

import styles from './Buttons.module.css';

type Buttons = {
	selected: 'total' | 'average';
	setSelected: (view: 'total' | 'average') => void;
};

const Buttons: React.FC<Buttons> = ({ selected, setSelected }) => {
	return (
		<fieldset className={styles.fieldset}>
			<label className={styles.label}>
				<div className={styles.radioWrapper}>
					<input
						type="radio"
						name="view"
						value="total"
						checked={selected === 'total'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
						className={styles.radio}
					/>
				</div>
				<span className={styles.labelText}>Total</span>
			</label>

			<label className={styles.label}>
				<div className={styles.radioWrapper}>
					<input
						type="radio"
						name="view"
						value="average"
						checked={selected === 'average'}
						onChange={(e) => setSelected(e.target.value as 'total' | 'average')}
						className={styles.radio}
					/>
				</div>
				<span className={styles.labelText}>Average</span>
			</label>
		</fieldset>
	);
};

export default Buttons;
