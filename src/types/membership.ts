import { IRegistration } from './registration';

export interface IMember {
  id: string;
  registrationId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  clubId: string;
  joinDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface IClubChangeHistory {
  id: string;
  memberId: string;
  oldClubId: string;
  newClubId: string;
  adminName: string;
  timestamp: string;
} 