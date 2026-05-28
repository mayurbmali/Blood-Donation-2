export interface BloodInventory {
  id: number;
  bloodGroup: string;
  unitsAvailable: number;
}

export interface InventoryDto {
  bloodGroup: string;
  unitsAvailable: number;
}
