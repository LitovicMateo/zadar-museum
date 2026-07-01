import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { VenueFormData } from '@/schemas/VenueSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Name: React.FC = () => {
  const { control } = useFormContext<VenueFormData>();
  return (
    <FormField
      control={control}
      name="name"
      rules={{ required: 'Venue name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Venue Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="e.g. Jazine" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Name;
