import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const GroupName: React.FC = () => {
  const { control, watch } = useFormContext<GameFormData>();

  const stage = watch('stage');

  if (stage !== 'group') return null;

  return (
    <FormField
      control={control}
      name="group_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Group Name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Group name (e.g. A, Liga za prvaka, Liga za ostanak, etc.)"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GroupName;
