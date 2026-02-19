import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import CoachBio from './coach-bio';

describe('CoachBio', () => {
    it('shows birth date and Age label when coach is alive', () => {
        const coach = {
            first_name: 'Alex',
            last_name: 'Johnson',
            date_of_birth: '1985-03-10',
            nationality: null
        } as any;

        render(<CoachBio coach={coach} />);

        expect(screen.getByText('Age:', { exact: false })).toBeTruthy();
        expect(screen.getByText('(10 Mar 1985)')).toBeTruthy();
    });

    it('shows Born/Died and aged when coach has date_of_death', () => {
        const coach = {
            first_name: 'Samuel',
            last_name: 'Lee',
            date_of_birth: '1940-04-01',
            date_of_death: '1990-04-02',
            nationality: null
        } as any;

        render(<CoachBio coach={coach} />);

        expect(screen.getByText(/Born:/)).toBeTruthy();
        expect(screen.getByText(/Died:/)).toBeTruthy();
        expect(screen.getByText('(aged 50)')).toBeTruthy();
    });
});
