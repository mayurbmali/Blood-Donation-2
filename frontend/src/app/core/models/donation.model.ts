import { Donor } from './donor.model';

export interface DonationHistory {
  id: number;
  donor: Donor;
  unitsDonated: number;
  donationDate: string;
}

export interface DonationDto {
  donorId: number;
  unitsDonated: number;
  donationDate: string;
}
