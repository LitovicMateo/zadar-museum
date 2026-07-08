import React from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Plus, X } from 'lucide-react';

import AppSelect from '@/components/forms/shared/AppSelect';
import StatField from '@/components/forms/shared/StatField';
import Button from '@/components/UI/Button';
import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';

const emptyRow = {
	team: '',
	teamName: '',
	teamShortName: '',
	gamesPlayed: '',
	wins: '',
	draws: '',
	losses: '',
	pointsDiff: '',
	points: ''
};

interface DisplayNameOption extends OptionType {
	short_name: string;
}

/**
 * Row-by-row standings editor. Each position is a team select (filtered so a team
 * can't be picked twice) + a display-name select (the team's primary name plus any
 * historical `alternate_names`, so the season-correct name is stored), then the
 * GP / W / D / L / +/- / PTS cells. Position is the row order (top = 1st place).
 */
const Standings: React.FC = () => {
	const { control, register, setValue } = useFormContext<LeagueTableFormData>();

	const { fields, append, remove } = useFieldArray<LeagueTableFormData, 'standings', 'id'>({
		control,
		name: 'standings'
	});

	const { data: teams } = useTeams('name', 'asc');

	const teamOptions: OptionType[] = (teams ?? []).map((t) => ({
		value: t.id.toString(),
		label: t.name
	}));

	// The team's primary name first (natural default), then its historical names.
	const getDisplayNameOptions = (teamId?: number): DisplayNameOption[] => {
		const team = teams?.find((t) => t.id === teamId);
		if (!team) return [];
		const main = { name: team.name, short_name: team.short_name };
		const alternates = team.alternate_names ?? [];
		return [main, ...alternates].map((n) => ({
			value: n.name,
			label: `${n.name} (${n.short_name})`,
			short_name: n.short_name
		}));
	};

	// Watch the picked team of every row so each select can hide teams chosen elsewhere.
	const watchedStandings = useWatch({ control, name: 'standings' }) as
		| { team?: string }[]
		| undefined;
	const selectedIds = Array.isArray(watchedStandings)
		? watchedStandings.map((row) => (row?.team ? String(row.team) : ''))
		: [];

	return (
		<div className="flex flex-col gap-2">
			{fields.map((field, index) => {
				const selectedExceptCurrent = selectedIds
					.filter((_, i) => i !== index)
					.filter(Boolean) as string[];

				const currentValue = selectedIds[index];

				const availableOptions = teamOptions.filter(
					(opt) =>
						String(opt.value) === currentValue || !selectedExceptCurrent.includes(String(opt.value))
				);

				const displayNameOptions = getDisplayNameOptions(currentValue ? +currentValue : undefined);

				return (
					<div
						key={field.id}
						className="flex flex-wrap items-end gap-2 rounded-md border border-border p-2 sm:flex-nowrap"
					>
						<span className="w-6 shrink-0 pb-1.5 text-center font-mono text-sm font-semibold text-muted-foreground">
							{index + 1}
						</span>

						<div className="flex min-w-[16rem] flex-1 flex-wrap items-end gap-2">
							<div className="min-w-[9rem] flex-1">
								<Controller
									control={control}
									name={`standings.${index}.team` as const}
									render={({ field: teamField }) => (
										<AppSelect
											placeholder="Select team"
											options={availableOptions}
											value={availableOptions.find((opt) => String(opt.value) === teamField.value) || null}
											onChange={(opt) => {
												const id = opt ? String(opt.value) : '';
												teamField.onChange(id);
												// Default the display name to the team's primary name (+ abbreviation).
												const team = teams?.find((t) => t.id === +id);
												setValue(`standings.${index}.teamName`, team?.name ?? '');
												setValue(`standings.${index}.teamShortName`, team?.short_name ?? '');
											}}
											isClearable
											styles={selectStyle()}
										/>
									)}
								/>
							</div>

							<div className="min-w-[9rem] flex-1">
								<Controller
									control={control}
									name={`standings.${index}.teamName` as const}
									render={({ field: nameField }) => (
										<AppSelect<DisplayNameOption, false>
											placeholder="Display name"
											options={displayNameOptions}
											value={displayNameOptions.find((opt) => opt.value === nameField.value) || null}
											onChange={(opt) => {
												nameField.onChange(opt?.value ?? '');
												setValue(`standings.${index}.teamShortName`, opt?.short_name ?? '');
											}}
											isDisabled={!currentValue}
											styles={selectStyle()}
										/>
									)}
								/>
							</div>
						</div>

						<StatField label="GP" className="w-14" {...register(`standings.${index}.gamesPlayed`)} />
						<StatField label="W" className="w-14" {...register(`standings.${index}.wins`)} />
						<StatField
							label="D"
							className="w-14"
							placeholder="–"
							{...register(`standings.${index}.draws`)}
						/>
						<StatField label="L" className="w-14" {...register(`standings.${index}.losses`)} />
						<StatField label="+/-" className="w-16" {...register(`standings.${index}.pointsDiff`)} />
						<StatField label="PTS" className="w-14" {...register(`standings.${index}.points`)} />

						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => remove(index)}
							title="Remove position"
							className="cursor-pointer"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				);
			})}

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => append({ ...emptyRow })}
				className="w-full! cursor-pointer text-xs"
			>
				<Plus className="mr-1 h-3 w-3" /> Add Position
			</Button>
		</div>
	);
};

export default Standings;
