import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const ShortName: React.FC = () => {
  const { control } = useFormContext<CompetitionFormData>();
  return (
    <FormField
      control={control}
      name="short_name"
      rules={{ required: 'Name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Short Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Short name (e.g. FPL)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ShortName;
