import { GroupBase, StylesConfig } from 'react-select';

export interface OptionType {
	value: string | number;
	label: string;
}

// ✅ Default generic = OptionType
export const selectStyle = <Option extends OptionType = OptionType>(
	width?: string,
	height = '32px'
): StylesConfig<Option, false, GroupBase<Option>> => ({
	control: (provided, state) => ({
		...provided,
		maxHeight: height,
		borderRadius: '0.25rem',
		border: `1px solid ${state.isFocused ? 'var(--record)' : 'var(--color-gray-400)'}`,
		fontSize: '14px',
		minHeight: height,
		height,
		padding: '0',
		background: 'transparent',
		boxShadow: state.isFocused
			? '0 0 0 2px color-mix(in oklch, var(--record) 35%, transparent)'
			: 'none',
		transition: 'color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
		'&:hover': {
			borderColor: state.isFocused ? 'var(--record)' : 'var(--color-gray-400)'
		}
	}),
	valueContainer: (provided) => ({
		...provided,
		height,
		padding: '0 12px'
	}),
	input: (provided) => ({
		...provided,
		margin: '0',
		padding: '0',
		color: 'var(--color-gray-800)'
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height
	}),
	indicatorSeparator: () => ({
		display: 'none'
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		padding: '0 6px',
		color: 'var(--color-gray-500)',
		'&:hover': {
			color: 'var(--color-gray-800)'
		}
	}),
	clearIndicator: (provided) => ({
		...provided,
		padding: '0 4px',
		color: 'var(--color-gray-500)',
		'&:hover': {
			color: 'var(--color-gray-800)'
		}
	}),
	placeholder: (provided) => ({
		...provided,
		fontSize: '12px',
		color: 'var(--color-gray-500)'
	}),
	singleValue: (provided) => ({
		...provided,
		fontSize: '14px',
		color: 'var(--color-gray-800)'
	}),
	container: (provided) => ({
		...provided,
		borderRadius: 'var(--radius)',
		border: 'none',
		background: 'transparent',
		boxShadow: 'none',
		minWidth: '120px',
		width: width ? width : '100%'
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? 'var(--primary)' : state.isFocused ? 'var(--accent)' : 'transparent',
		color: state.isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
		padding: '10px 12px',
		fontSize: '14px',
		cursor: 'pointer',
		transition: 'background-color 0.1s ease',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		'&:active': {
			backgroundColor: 'var(--primary)',
			color: 'var(--primary-foreground)'
		}
	}),
	menu: (provided) => ({
		...provided,
		borderRadius: 'var(--radius)',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		border: '1px solid var(--border)',
		background: 'var(--popover)',
		overflow: 'hidden',
		fontSize: '14px',
		zIndex: 2147483647,
		width: '100%'
	}),
	menuPortal: (provided) => {
		const zIndex = { zIndex: 2147483647 };
		if (typeof window === 'undefined' || typeof provided.left !== 'number' || typeof provided.width !== 'number') {
			return { ...provided, ...zIndex };
		}
		// Widen the menu so long option labels aren't clipped, but never past
		// however much room is actually left to the right of the control — this
		// keeps it within the viewport instead of overflowing off-screen.
		const maxMenuWidth = 320;
		const available = window.innerWidth - provided.left - 8;
		const width = Math.max(provided.width, Math.min(maxMenuWidth, available));
		return { ...provided, width, ...zIndex };
	}
});
