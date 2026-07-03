import React from 'react';
import { useFormContext } from 'react-hook-form';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { GameFormData } from '@/schemas/GameSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface DisplayNameOption extends OptionType {
  short_name: string;
}

const AwayTeamName: React.FC = () => {
  const { control, watch, setValue } = useFormContext<GameFormData>();
  const awayTeam = +watch('away_team');

  const { data: teams } = useTeams('slug', 'asc');

  if (!teams) return null;

  const getDisplayNameOptions = (teamId?: number): DisplayNameOption[] => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return [];

    const main = { name: team.name, short_name: team.short_name };
    const alternates = team.alternate_names ?? [];

    return [main, ...alternates].map((n) => ({
      value: n.name,
      label: `${n.name} (${n.short_name})`,
      short_name: n.short_name,
    }));
  };

  return (
    <FormField
      control={control}
      name="away_team_name"
      render={({ field }) => {
        const options = getDisplayNameOptions(awayTeam);
        return (
          <FormItem>
            <FormLabel>Away Team Display Name</FormLabel>
            <FormControl>
              <AppSelect<DisplayNameOption, false>
                onChange={(option) => {
                  field.onChange(option?.value);
                  setValue('away_team_short_name', option?.short_name ?? '');
                }}
                value={options.find((opt) => opt.value === field.value) ?? null}
                options={options}
                placeholder="Select away team display name"
                isDisabled={!awayTeam}
                styles={selectStyle()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default AwayTeamName;
