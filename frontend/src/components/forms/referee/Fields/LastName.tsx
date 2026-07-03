import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { RefereeFormData } from '@/schemas/RefereeSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const LastName: React.FC = () => {
  const { control } = useFormContext<RefereeFormData>();
  return (
    <FormField
      control={control}
      name="last_name"
      rules={{ required: 'Last name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Last Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LastName;
