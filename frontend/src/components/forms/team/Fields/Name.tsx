import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { TeamFormData } from '@/schemas/TeamSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Name: React.FC = () => {
  const { control } = useFormContext<TeamFormData>();
  return (
    <FormField
      control={control}
      name="name"
      rules={{ required: 'Team name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Team Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Team name (e.g. KK Zadar)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Name;
