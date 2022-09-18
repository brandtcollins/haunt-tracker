export interface iHauntedHouse {
  haunted_house_id: string;
  created_at: string;
  name: string;
  description: string;
  location: null | string;
  image: string;
}

export interface iCheckIn {
  checkin_id?: string;
  created_at?: string;
  haunted_house_id: string;
  rating: number | undefined;
  user_id: string;
  note?: string;
  estimated_wait_time?: number | undefined;
  actual_wait_time?: number | undefined;
}
