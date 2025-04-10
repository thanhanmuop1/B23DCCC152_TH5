export interface IClub {
  id: string;
  name: string;
  avatar: string;
  foundedDate: string;
  description: string;
  president: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IClubMember {
  id: string;
  clubId: string;
  fullName: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface IStatistics {
  totalClubs: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
}

export interface IClubStatistics {
  clubName: string;
  pending: number;
  approved: number;
  rejected: number;
} 