import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/UI/Input';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Attendance: React.FC = () => {
  const { control } = useFormContext<GameFormData>();
  return (
    <FormField
      control={control}
      name="attendance"
      rules={{ required: 'Attendance is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attendance <span className="text-destructive text-xs">*</span></FormLabel>
          <FormControl>
            <Input type="text" placeholder="Attendance" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Attendance;
