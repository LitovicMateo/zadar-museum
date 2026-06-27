import React from 'react';

import { Search } from 'lucide-react';

type OpponentSearchProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

const OpponentSearch: React.FC<OpponentSearchProps> = ({ value, onChange, placeholder = 'Search opponent…' }) => (
	<div className="relative">
		<Search
			size={16}
			className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
		/>
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
		/>
	</div>
);

export default OpponentSearch;
