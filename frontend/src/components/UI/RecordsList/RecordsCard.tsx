import { type ReactNode } from 'react';

type RecordsCardProps = {
	children: ReactNode;
};

const RecordsCard = ({ children }: RecordsCardProps) => {
	return <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">{children}</div>;
};

export default RecordsCard;
