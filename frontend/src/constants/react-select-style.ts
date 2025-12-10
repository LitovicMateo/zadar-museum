import { GroupBase, StylesConfig } from 'react-select';

export interface OptionType {
	value: string | number;
	label: string;
}

// ✅ Default generic = OptionType
export const selectStyle = <Option extends OptionType = OptionType>(
	width?: string
): StylesConfig<Option, false, GroupBase<Option>> => ({
	control: (provided) => ({
		...provided,
		maxHeight: '24px',
		borderRadius: '4px',
		border: '1px solid #99a1af',
		fontSize: '14px',
		minHeight: '32px',
		height: '32px',
		padding: '0 4px'
	}),
	valueContainer: (provided) => ({
		...provided,
		height: '32px',
		padding: '0 8px'
	}),
	input: (provided) => ({
		...provided,
		margin: '0',
		padding: '0'
	}),
	indicatorsContainer: (provided) => ({
		...provided,
		height: '32px'
	}),
	placeholder: (provided) => ({
		...provided,
		fontSize: '12px'
	}),
	container: (provided) => ({
		...provided,
		borderRadius: '4px',
		border: 'none',
		background: 'transparent',
		boxShadow: 'none',
		minWidth: '120px',
		width: width ? width : '100%'
		// 🚫 Remove zIndex here
	}),
	// ✅ Ensure dropdown always appears on top (high z-index to beat app stacking contexts)
	menuPortal: (base) => ({ ...base, zIndex: 2147483647 }),
	menu: (base) => ({ ...base, zIndex: 2147483647 })
});
