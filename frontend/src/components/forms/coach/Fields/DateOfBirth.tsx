import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CoachFormData } from '@/schemas/CoachSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const DateOfBirth: React.FC = () => {
  const { control } = useFormContext<CoachFormData>();
  return (
    <FormField
      control={control}
      name="date_of_birth"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date of Birth</FormLabel>
          <FormControl>
            <Input type="date" {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateOfBirth;
