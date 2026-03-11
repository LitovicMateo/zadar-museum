// components/games-page/games-filter/search-bar.tsx
import React from 'react';

import { Input } from '@/components/ui/Input';
import styles from './SearchBar.module.css';

type SearchBarProps = {
	searchTerm: string;
	setSearchTerm: (s: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
	return (
		<div className={styles.wrapper}>
			<Input
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				placeholder="Search teams"
			/>
		</div>
	);
};

export default SearchBar;
