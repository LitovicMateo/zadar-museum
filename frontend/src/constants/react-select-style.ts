import { GroupBase, StylesConfig } from 'react-select';

export interface OptionType {
	value: string | number;
	label: string;
}

// ✅ Default generic = OptionType
export const selectStyle = <Option extends OptionType = OptionType>(
	width?: string
): StylesConfig<Option, false, GroupBase<Option>> => ({
	control: (provided, state) => ({
		...provided,
		maxHeight: '40px',
		borderRadius: '8px',
		border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
		fontSize: '14px',
		minHeight: '40px',
		height: '40px',
		padding: '0 4px',
		boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		transition: 'all 0.2s ease',
		'&:hover': {
			borderColor: '#9ca3af'
		}
	}),
	valueContainer: (provided) => ({
		...provided,
		height: '40px',
		padding: '0 12px'
	}),
	input: (provided) => ({
		...provided,
		margin: '0',
		padding: '0'
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height: '40px'
	}),
	placeholder: (provided) => ({
		...provided,
		fontSize: '14px',
		color: '#9ca3af'
	}),
	container: (provided) => ({
		...provided,
		borderRadius: '8px',
		border: 'none',
		background: 'transparent',
		boxShadow: 'none',
		minWidth: '120px',
		width: width ? width : '100%'
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
		color: state.isSelected ? 'white' : '#1f2937',
		padding: '10px 12px',
		cursor: 'pointer',
		transition: 'all 0.15s ease',
		'&:active': {
			backgroundColor: '#3b82f6'
		}
	}),
	menu: (provided) => ({
		...provided,
		borderRadius: '8px',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		border: '1px solid #e5e7eb',
		overflow: 'hidden',
		zIndex: 2147483647
	}),
	menuPortal: (base) => ({ ...base, zIndex: 2147483647 })
});
