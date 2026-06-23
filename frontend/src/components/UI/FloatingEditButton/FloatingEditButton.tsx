import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

import Button from '@/components/UI/Button';

import styles from './FloatingEditButton.module.css';

interface FloatingEditButtonProps {
	to: string;
}

const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ to }) => {
	const navigate = useNavigate();

	return (
		<Button className={styles.floatingEditButton} onClick={() => navigate(to)}>
			<Pencil size={16} />
			Edit
		</Button>
	);
};

export default FloatingEditButton;
