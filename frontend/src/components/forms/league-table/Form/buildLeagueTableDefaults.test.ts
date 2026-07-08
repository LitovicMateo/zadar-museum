import { describe, expect, it } from 'vitest';

import { LeagueTableRecord } from '@/types/api/LeagueTable';

import { buildLeagueTableDefaults } from './buildLeagueTableDefaults';

describe('buildLeagueTableDefaults', () => {
	it('maps a record with standings to a flat string form shape', () => {
		const record: LeagueTableRecord = {
			id: 1,
			documentId: 'abc',
			season: '2025',
			stageNumber: 1,
			stageName: 'Regular Season',
			competition: { id: 7, documentId: 'comp7', name: 'ABA League' },
			standings: [
				{ team: 12, teamName: 'KK Zadar', teamShortName: 'ZAD', gamesPlayed: 30, wins: 22, draws: null, losses: 8, pointsDiff: 180, points: 52 },
				{ team: 5, teamName: null, teamShortName: null, gamesPlayed: 30, wins: 20, draws: 2, losses: 8, pointsDiff: -20, points: 50 }
			]
		};

		expect(buildLeagueTableDefaults(record)).toEqual({
			season: '2025',
			competition: '7',
			stageNumber: '1',
			stageName: 'Regular Season',
			standings: [
				{ team: '12', teamName: 'KK Zadar', teamShortName: 'ZAD', gamesPlayed: '30', wins: '22', draws: '', losses: '8', pointsDiff: '180', points: '52' },
				{ team: '5', teamName: '', teamShortName: '', gamesPlayed: '30', wins: '20', draws: '2', losses: '8', pointsDiff: '-20', points: '50' }
			]
		});
	});

	it('handles missing competition, stage name and empty standings', () => {
		const record: LeagueTableRecord = {
			id: 2,
			documentId: 'def',
			season: '2024',
			stageNumber: 2,
			stageName: null,
			competition: null,
			standings: []
		};

		expect(buildLeagueTableDefaults(record)).toEqual({
			season: '2024',
			competition: '',
			stageNumber: '2',
			stageName: '',
			standings: []
		});
	});
});
