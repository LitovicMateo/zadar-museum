import React from 'react';
import styles from './SidebarGroup.module.css';

type SidebarGroupProps = {
label?: string;
children: React.ReactNode;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
return (
<div id="group" className={styles.group}>
{label && <div className={styles.label}>{label}</div>}
<div className={styles.items}>{children}</div>
</div>
);
};

export default SidebarGroup;
