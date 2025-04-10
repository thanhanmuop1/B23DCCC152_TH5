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