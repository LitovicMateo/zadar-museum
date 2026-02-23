import React, { useId } from 'react';
import Radio from '@/components/ui/radio';
import RadioGroup from '@/components/ui/radio-group/RadioGroup';

export type MatchLocation = 'total' | 'home' | 'away' | 'neutral';

type Props = {
  value: MatchLocation;
  onChange: (v: MatchLocation) => void;
  hasNeutral?: boolean;
  className?: string;
  radioClassName?: string;
  inputClassName?: string;
  name?: string;
  title?: string;
};

const LocationSelector: React.FC<Props> = ({
  value,
  onChange,
  hasNeutral = true,
  className,
  radioClassName,
  inputClassName,
  name,
  title = 'Location',
}) => {
  const id = useId();
  const groupName = name ?? `location-${id}`;

  return (
    <RadioGroup title={title} className={className}>
      <Radio name={groupName} value="total" checked={value === 'total'} onChange={(e) => onChange(e.target.value as MatchLocation)} label="Total" className={radioClassName} inputClassName={inputClassName} />
      <Radio name={groupName} value="home" checked={value === 'home'} onChange={(e) => onChange(e.target.value as MatchLocation)} label="Home" className={radioClassName} inputClassName={inputClassName} />
      <Radio name={groupName} value="away" checked={value === 'away'} onChange={(e) => onChange(e.target.value as MatchLocation)} label="Away" className={radioClassName} inputClassName={inputClassName} />
      <Radio name={groupName} value="neutral" checked={value === 'neutral'} onChange={(e) => onChange(e.target.value as MatchLocation)} label="Neutral" className={hasNeutral ? (radioClassName ?? undefined) : `${radioClassName ?? ''} disabled`} inputClassName={inputClassName} disabled={!hasNeutral} />
    </RadioGroup>
  );
};

export default LocationSelector;
