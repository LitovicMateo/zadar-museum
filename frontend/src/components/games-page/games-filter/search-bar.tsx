// components/games-page/games-filter/search-bar.tsx
import React from 'react';

import { Input } from '@/components/ui/input';

type SearchBarProps = {
	searchTerm: string;
	setSearchTerm: (s: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
	return (
		<div className="w-full">
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
