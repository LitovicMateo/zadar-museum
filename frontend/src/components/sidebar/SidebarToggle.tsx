import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/Utils';
import styles from './SidebarToggle.module.css';

type SidebarToggleProps = {
isOpen: boolean;
setIsOpen: (isOpen: boolean) => void;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, setIsOpen }) => {
return (
<button
aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
onClick={() => setIsOpen(!isOpen)}
className={styles.button}
>
<ChevronLeft className={cn(styles.icon, !isOpen && styles.iconRotated)} />
</button>
);
};

export default SidebarToggle;
