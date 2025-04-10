import { useState, useEffect } from 'react';
import { IStatistics, IClubStatistics } from '@/types/club';

export default () => {
  const [statistics, setStatistics] = useState<IStatistics>({
    totalClubs: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
  });

  const [clubStatistics, setClubStatistics] = useState<IClubStatistics[]>([]);

  const calculateStatistics = () => {
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

    // Tính số lượng chung
    setStatistics({
      totalClubs: clubs.length,
      pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
      approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
      rejectedRegistrations: registrations.filter(r => r.status === 'rejected').length,
    });

    // Tính số lượng theo từng CLB
    const clubStats = clubs.map(club => {
      const clubRegs = registrations.filter(r => r.clubId === club.id);
      return {
        clubName: club.name,
        pending: clubRegs.filter(r => r.status === 'pending').length,
        approved: clubRegs.filter(r => r.status === 'approved').length,
        rejected: clubRegs.filter(r => r.status === 'rejected').length,
      };
    });
    setClubStatistics(clubStats);
  };

  useEffect(() => {
    calculateStatistics();
  }, []);

  return {
    statistics,
    clubStatistics,
    calculateStatistics,
  };
}; 