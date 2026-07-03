import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './SidebarWrapper.module.css';

type SidebarWrapperProps = {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children, isOpen, className, style }) => (
  <aside
    aria-expanded={isOpen}
    className={cn(styles.aside, isOpen ? styles.open : styles.closed, className)}
    style={style}
  >
    <div className={styles.inner}>{children}</div>
  </aside>
);

export default SidebarWrapper;
