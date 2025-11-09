import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { Input } from '@/components/ui/input';

interface UseSearchOptions {
	placeholder?: string;
	className?: string;
}

export function useSearch({ placeholder = 'Search...', className = '' }: UseSearchOptions = {}) {
	const [searchTerm, setSearchTerm] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [showPortal, setShowPortal] = useState(false);

	const location = useLocation(); // Detects URL/path changes

	// Handle input changes
	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);

	// Handle focus and blur
	const handleFocus = useCallback(() => setIsFocused(true), []);
	const handleBlur = useCallback(() => {
		// Slight delay so clicks on the portal aren't lost
		setTimeout(() => setIsFocused(false), 150);
	}, []);

	// Control when the portal should be visible
	useEffect(() => {
		if (isFocused && searchTerm.trim().length > 1) {
			setShowPortal(true);
		} else {
			setShowPortal(false);
		}
	}, [isFocused, searchTerm]);

	// Clear search when URL changes
	useEffect(() => {
		setSearchTerm('');
		setShowPortal(false);
	}, [location.pathname]);

	// Manually clear search (e.g., on item click)
	const clearSearch = useCallback(() => {
		setSearchTerm('');
		setShowPortal(false);
	}, []);

	const SearchInput = (
		<Input
			type="text"
			value={searchTerm}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			placeholder={placeholder}
			className={className}
		/>
	);

	return { searchTerm, showPortal, clearSearch, SearchInput };
}
