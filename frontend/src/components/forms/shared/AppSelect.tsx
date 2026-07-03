import ReactSelect, { GroupBase, Props } from 'react-select';

/**
 * react-select with its menu portaled to <body> so it escapes `overflow-hidden`
 * ancestors (e.g. FormCard). Menu z-index/appearance still come from the caller's
 * `styles={selectStyle()}` (its `menuPortal` style sets the z-index).
 */
function AppSelect<
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
	return (
		<ReactSelect
			menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
			menuPosition="fixed"
			{...props}
		/>
	);
}

export default AppSelect;
