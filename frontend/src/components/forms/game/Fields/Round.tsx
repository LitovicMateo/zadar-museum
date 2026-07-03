import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { Input } from '@/components/UI/Input';
import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const playoffRounds: OptionType[] = [
  { label: 'Round of 64', value: 'R64' },
  { label: 'Round of 32', value: 'R32' },
  { label: 'Round of 16', value: 'R16' },
  { label: 'Quarter-finals', value: 'QF' },
  { label: 'Semi-finals', value: 'SF' },
  { label: 'Third place', value: '3RD' },
  { label: 'Final', value: 'F' },
];

const Round: React.FC = () => {
  const { control, watch } = useFormContext<GameFormData>();

  const stage = watch('stage');

  if (!stage) return null;

  if (stage === 'playoff') {
    return (
      <FormField
        control={control}
        name="round"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Round</FormLabel>
            <FormControl>
              <AppSelect<OptionType, false>
                placeholder="Select round"
                options={playoffRounds}
                value={playoffRounds.find((opt) => opt.value === field.value) ?? null}
                onChange={(opt) => field.onChange(opt?.value)}
                isClearable
                styles={selectStyle()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name="round"
      rules={{ required: 'Round is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Round <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Round (e.g. 1, 2, etc.)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Round;
