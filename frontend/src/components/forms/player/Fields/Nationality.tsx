import { useFormContext } from 'react-hook-form';

import CountrySelect from '@/components/CountrySelect/CountrySelect';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const Nationality = () => {
  const { control } = useFormContext<PlayerFormData>();
  return (
    <FormField
      control={control}
      name="nationality"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nationality</FormLabel>
          <FormControl>
            <CountrySelect
              selectedValue={field.value}
              onChange={(value) => field.onChange(value ?? null)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Nationality;
