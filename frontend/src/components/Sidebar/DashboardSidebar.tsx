import React, { useEffect, useState } from 'react';

import ClearCacheButton from '../UI/ClearCacheButton/ClearCacheButton';
import DashboardSidebarRow, { type DashboardNavItem } from './DashboardSidebarRow';
import SidebarContent from './SidebarContent';
import SidebarTitle from './SidebarTitle';
import SidebarToggle from './SidebarToggle';
import SidebarWrapper from './SidebarWrapper';

import styles from './DashboardSidebar.module.css';

type DashboardSidebarProps = {
  navItems: DashboardNavItem[];
  statsItems: DashboardNavItem[];
  onLinkClick?: () => void;
  isEmbedded?: boolean;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  navItems,
  statsItems,
  onLinkClick,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [shouldRenderContent, setShouldRenderContent] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOpen) {
      timeout = setTimeout(() => setShouldRenderContent(true), 300);
    } else {
      setShouldRenderContent(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const content = shouldRenderContent ? (
    <div className={styles.sidebar}>
      <SidebarTitle title="Dashboard" />
      <SidebarContent>
        <div>
          <div className={styles.sectionLabel}>Manage</div>
          <ul className={styles.list}>
            {navItems.map((item) => (
              <DashboardSidebarRow key={item.label} {...item} onLinkClick={onLinkClick} />
            ))}
          </ul>
        </div>
        <div className={styles.divider} />
        <div>
          <div className={styles.sectionLabel}>Stats</div>
          <ul className={styles.list}>
            {statsItems.map((item) => (
              <DashboardSidebarRow key={item.label} {...item} onLinkClick={onLinkClick} />
            ))}
          </ul>
        </div>
        <div className="[&_button]:border-white/25 [&_button]:text-white/70 [&_button]:hover:bg-white/10 [&_button]:hover:text-white [&_button]:w-full">
          <ClearCacheButton />
        </div>
      </SidebarContent>
    </div>
  ) : null;

  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col overflow-y-auto p-4">
        {content}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SidebarWrapper isOpen={isOpen} className="bg-court border-r border-white/15">
        {content}
      </SidebarWrapper>
      <div className={styles.toggle}>
        <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default DashboardSidebar;
