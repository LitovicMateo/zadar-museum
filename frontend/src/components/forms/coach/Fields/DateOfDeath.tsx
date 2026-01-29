import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { CoachFormData } from '@/schemas/coach-schema';

const DateOfDeath: React.FC = () => {
    const { register } = useFormContext<CoachFormData>();

    return (
        <label>
            <span className="text-sm  text-gray-700 uppercase">Date of Death: </span>
            <Input
                type="date"
                {...register('date_of_death', { required: false })}
                className="text-gray-500 placeholder:text-xs"
            />
        </label>
    );
};

export default DateOfDeath;
