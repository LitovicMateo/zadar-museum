import React from 'react';
import { useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/CountrySelect/CountrySelect';
import { RefereeFormData } from '@/schemas/RefereeSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Nationality: React.FC = () => {
  const { control } = useFormContext<RefereeFormData>();
  return (
    <FormField
      control={control}
      name="nationality"
      rules={{ required: 'Nationality is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nationality <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <CountrySelect
              {...field}
              onChange={(value) => field.onChange(value)}
              selectedValue={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Nationality;
