import { User } from './auth.model';

export interface BloodRequest {
  id: number;
  requesterName: string;
  requester?: User;
  bloodGroup: string;
  units: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface BloodRequestDto {
  bloodGroup: string;
  units: number;
}
