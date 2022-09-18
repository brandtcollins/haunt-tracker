export interface iHauntedHouse {
  haunted_house_id: string;
  created_at: string;
  name: string;
  description: string;
  location: null | string;
  image: string;
  notes?: string;
}

export interface iCheckIn {
  checkin_id?: string;
  created_at?: string;
  haunted_house_id: string;
  rating: number;
  user_id: string;
  haunted_house_name: string;
  note?: string;
  estimated_wait_time?: number;
  actual_wait_time?: number;
}
