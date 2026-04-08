import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { Input } from '@/components/UI/Input';

interface UseSearchOptions {
	placeholder?: string;
	className?: string;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function useSearch({ placeholder = 'Search...', className = '', onKeyDown }: UseSearchOptions = {}) {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedTerm, setDebouncedTerm] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [showPortal, setShowPortal] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const location = useLocation();

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);

	const handleFocus = useCallback(() => setIsFocused(true), []);
	const handleBlur = useCallback(() => {
		// Slight delay so clicks on the portal aren't lost
		setTimeout(() => setIsFocused(false), 150);
	}, []);

	// Debounce: propagate to debouncedTerm 300 ms after the last keystroke
	useEffect(() => {
		const id = setTimeout(() => setDebouncedTerm(searchTerm), 300);
		return () => clearTimeout(id);
	}, [searchTerm]);

	// Show portal only after the debounced term has at least 2 meaningful chars
	useEffect(() => {
		if (isFocused && debouncedTerm.trim().length > 1) {
			setShowPortal(true);
		} else {
			setShowPortal(false);
		}
	}, [isFocused, debouncedTerm]);

	// Clear search when navigating to a new route
	useEffect(() => {
		setSearchTerm('');
		setDebouncedTerm('');
		setShowPortal(false);
	}, [location.pathname]);

	const clearSearch = useCallback(() => {
		setSearchTerm('');
		setDebouncedTerm('');
		setShowPortal(false);
	}, []);

	const SearchInput = (
		<Input
			ref={inputRef}
			type="text"
			value={searchTerm}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			className={className}
		/>
	);

	return { searchTerm, debouncedTerm, showPortal, clearSearch, SearchInput, inputRef };
}
