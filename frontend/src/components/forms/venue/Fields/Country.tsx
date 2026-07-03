import React from 'react';
import { useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/CountrySelect/CountrySelect';
import { VenueFormData } from '@/schemas/VenueSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Country: React.FC = () => {
  const { control } = useFormContext<VenueFormData>();
  return (
    <FormField
      control={control}
      name="country"
      rules={{ required: 'Country is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <CountrySelect
              {...field}
              selectedValue={(field.value as string) || ''}
              onChange={(value) => field.onChange(value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Country;
