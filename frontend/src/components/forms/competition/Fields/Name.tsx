import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Name: React.FC = () => {
  const { control } = useFormContext<CompetitionFormData>();
  return (
    <FormField
      control={control}
      name="name"
      rules={{ required: 'Name is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Competition Name <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Competition name (e.g. FAVBET Premijer Liga)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Name;
