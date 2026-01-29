export const PLAYOFF_ROUND_MAP: Record<string, string> = {
    R64: 'Round of 64',
    R32: 'Round of 32',
    R16: 'Round of 16',
    QF: 'Quarter-final',
    SF: 'Semi-final',
    '3RD': 'Third place',
    F: 'Final',
};

export const PLAYOFF_ROUND_OPTIONS = Object.entries(PLAYOFF_ROUND_MAP).map(([value, label]) => ({
    label,
    value,
}));

export function getRoundLabel(stage: string | null | undefined, round: string | null | undefined): string {
    if (stage === 'league') return `Round ${round}`;
    if (stage === 'group') return `Group ${round}`;
    if (stage === 'playoff') return PLAYOFF_ROUND_MAP[String(round)] || String(round);
    return String(round ?? '');
}

export default getRoundLabel;
