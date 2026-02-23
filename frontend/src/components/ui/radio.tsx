import React from 'react';

export interface RadioProps extends React.ComponentProps<'input'> {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  id?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  id,
  className,
  inputClassName,
  labelClassName,
  ...props
}) => {
  const { disabled } = props as { disabled?: boolean };
  const inputId = id ?? `${name}-${String(value)}`;

  const wrapperClass = `flex gap-2 items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className ?? ''}`.trim();
  const inputClass = `${inputClassName ?? 'w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;
  const textClass = `${labelClassName ?? ''}`;

  return (
    <label className={wrapperClass}>
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
      {label && <span className={textClass}>{label}</span>}
    </label>
  );
};

export default Radio;
