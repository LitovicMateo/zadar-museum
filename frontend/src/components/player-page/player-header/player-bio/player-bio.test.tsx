import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import PlayerBio from './player-bio';

describe('PlayerBio', () => {
    it('shows birth date and Age label when player is alive', () => {
        const player = {
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1990-01-15',
            nationality: null,
            primary_position: null,
            secondary_position: null
        } as any;

        render(<PlayerBio player={player} />);

        expect(screen.getByText('Age:', { exact: false })).toBeTruthy();
        expect(screen.getByText('(15 Jan 1990)')).toBeTruthy();
    });

    it('shows Born/Died and aged when player has date_of_death', () => {
        const player = {
            first_name: 'Jane',
            last_name: 'Smith',
            date_of_birth: '1950-06-01',
            date_of_death: '2000-06-02',
            nationality: null,
            primary_position: null,
            secondary_position: null
        } as any;

        render(<PlayerBio player={player} />);

        expect(screen.getByText(/Born:/)).toBeTruthy();
        expect(screen.getByText(/Died:/)).toBeTruthy();
        expect(screen.getByText('(aged 50)')).toBeTruthy();
    });
});
