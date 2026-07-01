import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Season: React.FC = () => {
  const { control } = useFormContext<GameFormData>();
  return (
    <FormField
      control={control}
      name="season"
      rules={{ required: 'Season is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Season <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" maxLength={4} placeholder="Season (e.g. 2025)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Season;
