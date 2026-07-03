import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const DateOfDeath: React.FC = () => {
  const { control } = useFormContext<PlayerFormData>();
  return (
    <FormField
      control={control}
      name="date_of_death"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date of Death (Optional)</FormLabel>
          <FormControl>
            <Input type="date" {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateOfDeath;
