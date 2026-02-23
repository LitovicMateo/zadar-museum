import React from 'react';
import styles from './radio-group.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const RadioGroup: React.FC<Props> = ({ title, children, className }) => {
  return (
    <div className={styles.group}>
      <p className={styles.labelTitle}>{title}</p>
      <fieldset className={`${styles.fieldset}${className ? ' ' + className : ''}`}>{children}</fieldset>
    </div>
  );
};

export default RadioGroup;
