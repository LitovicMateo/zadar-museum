import React, { useId } from 'react';
import Radio from '@/components/ui/radio';
import RadioGroup from '@/components/ui/radio-group/RadioGroup';

export type CoachRole = 'total' | 'headCoach' | 'assistantCoach';

type Props = {
  value: CoachRole;
  onChange: (v: CoachRole) => void;
  className?: string;
  radioClassName?: string;
  name?: string;
  title?: string;
};

const CoachRoleSelector: React.FC<Props> = ({ value, onChange, className, radioClassName, name, title = 'Coach Role' }) => {
  const id = useId();
  const groupName = name ?? `coachRole-${id}`;

  return (
    <RadioGroup title={title} className={className}>
      <Radio name={groupName} value="total" checked={value === 'total'} onChange={(e) => onChange(e.target.value as CoachRole)} label="Total" className={radioClassName} />
      <Radio name={groupName} value="headCoach" checked={value === 'headCoach'} onChange={(e) => onChange(e.target.value as CoachRole)} label="Head" className={radioClassName} />
      <Radio name={groupName} value="assistantCoach" checked={value === 'assistantCoach'} onChange={(e) => onChange(e.target.value as CoachRole)} label="Assistant" className={radioClassName} />
    </RadioGroup>
  );
};

export default CoachRoleSelector;
