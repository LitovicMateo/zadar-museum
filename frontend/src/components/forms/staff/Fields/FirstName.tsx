import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { StaffFormData } from '@/schemas/StaffSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const FirstName: React.FC = () => {
  const { control } = useFormContext<StaffFormData>();
  return (
    <FormField
      control={control}
      name="first_name"
      rules={{ required: 'First name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="First Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FirstName;
