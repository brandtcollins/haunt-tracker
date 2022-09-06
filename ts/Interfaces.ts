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
  rating: number;
  user_id: string;
}
