import React from 'react';
import styles from './RadioButtons.module.css';

type RadioButtonsProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, setSelected }) => {
	return (
		<form action="">
			<fieldset className={styles.fieldset}>
				<label className={styles.label}>
					<div className={styles.radioWrap}>
						<input
							type="radio"
							name="player"
							value={'player'}
							checked={selected === 'player'}
							onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
							className={styles.input}
						/>
					</div>
					<span className={styles.labelText}>
						Player
					</span>
				</label>
				<label className={styles.label}>
					<div className={styles.radioWrap}>
						<input
							type="radio"
							name="coach"
							value={'coach'}
							checked={selected === 'coach'}
							onChange={(e) => setSelected(e.target.value as 'player' | 'coach')}
							className={styles.input}
						/>
					</div>
					<span className={styles.labelText}>
						Coach
					</span>
				</label>
			</fieldset>
		</form>
	);
};

export default RadioButtons;
