import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Date: React.FC = () => {
  const { control } = useFormContext<GameFormData>();
  return (
    <FormField
      control={control}
      name="date"
      rules={{ required: 'Date is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="date" {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Date;
