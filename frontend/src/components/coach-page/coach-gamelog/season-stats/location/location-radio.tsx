import React from 'react';
import LocationSelector from '@/components/coach-page/shared/LocationSelector';

type Props = {
  location: 'total' | 'home' | 'away' | 'neutral';
  setLocation: (l: 'total' | 'home' | 'away' | 'neutral') => void;
  hasNeutral: boolean;
};

const LocationRadio: React.FC<Props> = ({ location, setLocation, hasNeutral }) => {
  return <LocationSelector value={location} onChange={setLocation} hasNeutral={hasNeutral} />;
};

export default LocationRadio;
