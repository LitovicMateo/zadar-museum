import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Height: React.FC = () => {
  const { control } = useFormContext<PlayerFormData>();
  return (
    <FormField
      control={control}
      name="height"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Height</FormLabel>
          <FormControl>
            <Input type="text" placeholder="e.g. 203 cm" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Height;
