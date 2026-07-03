import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

interface FloatingEditButtonProps {
	to: string;
}

const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ to }) => {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onClick={() => navigate(to)}
			className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-court px-5 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 transition hover:bg-court/90"
		>
			<Pencil size={16} className="text-record" />
			Edit
		</button>
	);
};

export default FloatingEditButton;
