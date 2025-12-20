import React from 'react';
import { Link } from 'react-router-dom';

type ResultProps = {
	item: string;
	url: string;
	clearSearch: () => void;
};

const Result: React.FC<ResultProps> = ({ item, url, clearSearch }) => {
	return (
		<li className="px-2" role="option">
			<Link to={url} onClick={clearSearch} aria-label={`Open ${item}`}>
				{item}
			</Link>
		</li>
	);
};

export default React.memo(Result);
