import { GroupBase, StylesConfig } from 'react-select';

export interface OptionType {
	value: string | number;
	label: string;
}

// ✅ Default generic = OptionType
export const selectStyle = <Option extends OptionType = OptionType>(
	width?: string,
	height = '40px'
): StylesConfig<Option, false, GroupBase<Option>> => ({
	control: (provided, state) => ({
		...provided,
		maxHeight: height,
		borderRadius: 'var(--radius)',
		border: state.isFocused ? '2px solid var(--ring)' : '1px solid var(--border)',
		fontSize: '14px',
		minHeight: height,
		height,
		padding: '0 4px',
		background: 'var(--card)',
		boxShadow: state.isFocused
			? '0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent)'
			: 'none',
		transition: 'color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
		'&:hover': {
			borderColor: 'var(--muted-foreground)'
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
		color: 'var(--foreground)'
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height
	}),
	indicatorSeparator: (provided) => ({
		...provided,
		backgroundColor: 'var(--border)'
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: 'var(--muted-foreground)',
		'&:hover': {
			color: 'var(--foreground)'
		}
	}),
	clearIndicator: (provided) => ({
		...provided,
		color: 'var(--muted-foreground)',
		'&:hover': {
			color: 'var(--foreground)'
		}
	}),
	placeholder: (provided) => ({
		...provided,
		fontSize: '14px',
		color: 'var(--muted-foreground)'
	}),
	singleValue: (provided) => ({
		...provided,
		color: 'var(--foreground)'
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
		cursor: 'pointer',
		transition: 'background-color 0.1s ease',
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
		zIndex: 2147483647
	}),
	menuPortal: (base) => ({ ...base, zIndex: 2147483647 })
});
