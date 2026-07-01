import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { PositionOption, positionOptions } from '../Constants/PlayerPositions';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export const SecondaryPosition: React.FC = () => {
  const { control, watch } = useFormContext<PlayerFormData>();
  const primaryPosition = watch('primary_position');

  return (
    <FormField
      control={control}
      name="secondary_position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Secondary Position</FormLabel>
          <FormControl>
            <Select<PositionOption, false>
              options={positionOptions}
              value={positionOptions.find((opt) => opt.value === field.value) || null}
              onChange={(selected) => field.onChange(selected?.value ?? null)}
              isDisabled={!primaryPosition}
              isClearable
              styles={selectStyle()}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
