import React from 'react';
import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/Utils';

import styles from './DashboardSidebar.module.css';

export type DashboardNavItem = {
  label: string;
  listPath: string;
  icon: LucideIcon;
  onLinkClick?: () => void;
};

const DashboardSidebarRow: React.FC<DashboardNavItem> = ({ label, listPath, icon: Icon, onLinkClick }) => {
  return (
    <li>
      <NavLink
        to={listPath}
        end={false}
        onClick={onLinkClick}
        className={({ isActive }) => cn(styles.row, isActive && styles.rowActive)}
      >
        <Icon size={15} className={styles.rowIcon} aria-hidden="true" />
        <span className={styles.rowLabel}>{label}</span>
      </NavLink>
    </li>
  );
};

export default DashboardSidebarRow;
