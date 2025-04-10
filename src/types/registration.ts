export interface IRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistrationHistory {
  id: string;
  registrationId: string;
  action: 'created' | 'approved' | 'rejected' | 'updated';
  adminName: string;
  reason?: string;
  timestamp: string;
} 