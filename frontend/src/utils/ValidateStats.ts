export type ValidateOptions = {
	checkPlayer?: boolean;
	checkTeam?: boolean;
};

export type FormValue = string | number | null | undefined;
export type FormDataShape = {
	[k: string]: FormValue;
};

const hasBoth = (a: FormValue, b: FormValue) =>
	a !== undefined && a !== null && a !== '' && b !== undefined && b !== null && b !== '';

export const validateStats = (data: unknown, options: ValidateOptions = {}) => {
	const form = data as FormDataShape;
	// Shooting validations (only when both made and attempted are provided)
	if (
		hasBoth(form.fieldGoalsMade, form.fieldGoalsAttempted) &&
		Number(form.fieldGoalsMade) > Number(form.fieldGoalsAttempted)
	) {
		throw new Error('Field goals made cannot be greater than field goals attempted.');
	}

	if (
		hasBoth(form.threePointersMade, form.threePointersAttempted) &&
		Number(form.threePointersMade) > Number(form.threePointersAttempted)
	) {
		throw new Error('Three-pointers made cannot be greater than three-pointers attempted.');
	}

	if (
		hasBoth(form.freeThrowsMade, form.freeThrowsAttempted) &&
		Number(form.freeThrowsMade) > Number(form.freeThrowsAttempted)
	) {
		throw new Error('Free throws made cannot be greater than free throws attempted.');
	}

	// Player-specific validations
	if (options.checkPlayer) {
		if (form.minutes !== undefined && form.minutes !== null && Number(form.minutes) < 0) {
			throw new Error('Minutes cannot be negative.');
		}

		if (
			form.seconds !== undefined &&
			form.seconds !== null &&
			(Number(form.seconds) < 0 || Number(form.seconds) >= 60)
		) {
			throw new Error('Seconds must be between 0 and 59.');
		}

		if (form.points !== undefined && form.points !== null && Number(form.points) < 0) {
			throw new Error('Points cannot be negative.');
		}

		// Player number validation: accept either `playerNumber` or `number` field
		// Player number validation — use schema field `playerNumber` (string)
		if (form.playerNumber !== undefined && form.playerNumber !== null && String(form.playerNumber).trim() !== '') {
			const str = String(form.playerNumber).trim();
			// Accept only 1 or 2 digits (allows "00", "0", "1"-"99"), no decimals or letters
			if (!/^\d{1,2}$/.test(str)) {
				throw new Error('Player number must be one or two digits (00, 0, 1-99).');
			}

			const parsed = Number.parseInt(str, 10);
			if (parsed < 0 || parsed > 99) {
				throw new Error('Player number must be between 0 and 99.');
			}
		}
	}

	// Team-specific validations
	if (options.checkTeam) {
		const quarters = [
			{ name: 'First quarter', value: form.firstQuarter },
			{ name: 'Second quarter', value: form.secondQuarter },
			{ name: 'Third quarter', value: form.thirdQuarter },
			{ name: 'Fourth quarter', value: form.fourthQuarter },
			{ name: 'Overtime', value: form.overtime }
		];

		for (const q of quarters) {
			if (q.value !== null && q.value !== undefined && Number(q.value) < 0) {
				throw new Error(`${q.name} score cannot be negative.`);
			}
		}
	}
};

export default validateStats;
