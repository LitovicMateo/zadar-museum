import React from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface DisplayNameOption {
  value: string;
  label: string;
  short_name: string;
}

const CompetitionName: React.FC = () => {
  const { control, watch, setValue } = useFormContext<GameFormData>();

  const { data: competitions } = useCompetitions('slug', 'asc');

  if (!competitions) return null;

  const getDisplayNameOptions = (competitionId?: number): DisplayNameOption[] => {
    const competition = competitions.find((c) => c.id === competitionId);
    if (!competition) return [];

    const main = { name: competition.name, short_name: competition.short_name };
    const alternates = competition.alternate_names ?? [];

    return [main, ...alternates].map((n) => ({
      value: n.name,
      label: `${n.name} (${n.short_name})`,
      short_name: n.short_name,
    }));
  };

  return (
    <FormField
      control={control}
      name="league_name"
      render={({ field }) => {
        const competitionId = watch('competition');
        const options = getDisplayNameOptions(competitionId ? +competitionId : undefined);
        return (
          <FormItem>
            <FormLabel>Competition Display Name</FormLabel>
            <FormControl>
              <Select<DisplayNameOption, false>
                onChange={(option) => {
                  field.onChange(option?.value);
                  setValue('league_short_name', option?.short_name ?? '');
                }}
                value={options.find((opt) => opt.value === field.value) ?? null}
                options={options}
                placeholder="Select competition display name"
                isDisabled={!competitionId}
                styles={selectStyle<DisplayNameOption>()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CompetitionName;
