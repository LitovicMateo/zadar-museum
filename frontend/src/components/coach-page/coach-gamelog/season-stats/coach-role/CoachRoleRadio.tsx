import React from 'react';
import CoachRoleSelector from '@/components/coach-page/shared/CoachRoleSelector';

type Props = {
  coachRole: 'total' | 'headCoach' | 'assistantCoach';
  setCoachRole: (r: 'total' | 'headCoach' | 'assistantCoach') => void;
};

const CoachRoleRadio: React.FC<Props> = ({ coachRole, setCoachRole }) => {
  return <CoachRoleSelector value={coachRole} onChange={setCoachRole} />;
};

export default CoachRoleRadio;
