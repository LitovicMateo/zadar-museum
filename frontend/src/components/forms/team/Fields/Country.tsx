import { useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/CountrySelect/CountrySelect';
import { TeamFormData } from '@/schemas/TeamSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Country = () => {
  const { control } = useFormContext<TeamFormData>();
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
              selectedValue={field.value}
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
