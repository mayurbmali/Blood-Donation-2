import { User } from './auth.model';

export interface Donor {
  id: number;
  user: User;
  bloodGroup: string;
  age: number;
  phone: string;
  lastDonationDate?: string;
}

export interface DonorDto {
  bloodGroup: string;
  age: number;
  phone: string;
}

export interface AdminCreateDonorRequest {
  name: string;
  email: string;
  password: string;
  bloodGroup: string;
  age: number;
  phone: string;
}
