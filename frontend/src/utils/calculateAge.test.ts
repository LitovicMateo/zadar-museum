import { describe, it, expect } from 'vitest';
import { calculateAge } from './calculateAge';

describe('calculateAge', () => {
    it('calculates age relative to reference date when birthday not yet occurred', () => {
        const age = calculateAge('2000-01-02', '2026-01-01');
        expect(age).toBe(25);
    });

    it('calculates exact age when reference is birthday', () => {
        const age = calculateAge('2000-01-01', '2026-01-01');
        expect(age).toBe(26);
    });

    it('handles same day birthday correctly', () => {
        const age = calculateAge('1980-06-15', '2020-06-15');
        expect(age).toBe(40);
    });
});
