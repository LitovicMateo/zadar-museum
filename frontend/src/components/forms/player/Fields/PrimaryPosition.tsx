import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { PositionOption, positionOptions } from '../Constants/PlayerPositions';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const PrimaryPosition: React.FC = () => {
  const { control } = useFormContext<PlayerFormData>();
  return (
    <FormField
      control={control}
      name="primary_position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Position</FormLabel>
          <FormControl>
            <Select<PositionOption, false>
              options={positionOptions}
              value={positionOptions.find((opt) => opt.value === field.value) || null}
              onChange={(selected) => field.onChange(selected?.value ?? null)}
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

export default PrimaryPosition;
