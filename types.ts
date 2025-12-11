export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: 'cabelo' | 'sobrancelha' | 'olhos' | 'outros';
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: '08:00' | '14:00';
  clientName: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export type TimeSlot = '08:00' | '14:00';

export interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason?: string;
}
