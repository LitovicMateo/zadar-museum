import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamFormData } from '@/schemas/TeamSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const ShortName: React.FC = () => {
  const { control } = useFormContext<TeamFormData>();
  return (
    <FormField
      control={control}
      name="short_name"
      rules={{ required: 'Short name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Short Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Short name (e.g. ZAD)" maxLength={3} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ShortName;
