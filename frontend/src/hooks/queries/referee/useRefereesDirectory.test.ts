import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useRefereesDirectory } from './useRefereesDirectory';
import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { useRefereeAllTimeStats } from '@/hooks/queries/stats/UseRefereeAllTimeStats';

vi.mock('@/hooks/queries/referee/UseReferees');
vi.mock('@/hooks/queries/stats/UseRefereeAllTimeStats');

describe('useRefereesDirectory', () => {
	it('attaches all-time stats to the matching referee by document id', () => {
		vi.mocked(useReferees).mockReturnValue({
			data: [
				{
					id: 1,
					documentId: 'doc-1',
					first_name: 'Josip',
					last_name: 'Radojkovic',
					image: null,
					nationality: 'HR'
				}
			],
			isLoading: false
		} as never);

		vi.mocked(useRefereeAllTimeStats).mockReturnValue({
			data: [
				{
					referee_id: 'doc-1',
					first_name: 'Josip',
					last_name: 'Radojkovic',
					games: '16',
					fouls_for: 21.2,
					fouls_against: 25.9,
					foul_difference: -4.6
				}
			],
			isLoading: false
		} as never);

		const { result } = renderHook(() => useRefereesDirectory());

		expect(result.current.directory?.[0].games).toBe('16');
		expect(result.current.directory?.[0].fouls_for).toBe('21.2');
	});
});
