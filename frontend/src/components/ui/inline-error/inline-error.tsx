import React from 'react';
import { AlertCircle } from 'lucide-react';

import styles from './inline-error.module.css';

interface InlineErrorProps {
  message?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  message = 'Something went wrong. Please try again.',
}) => {
  return (
    <div className={styles.container} role="alert">
      <AlertCircle className={styles.icon} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
