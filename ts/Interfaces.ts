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
  express?: boolean;
  user?: iUserSettings;
  haunted_houses?: iHauntedHouse;
}

export interface iMagicLinkSignin {
  email: string;
}

export interface iUserNavigationProps {
  name: string;
  href: string;
  onClick?: any;
}

export interface iNewUserSignup {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface iUserSignIn {
  email: string;
  password: string;
}

export interface iUserSettings {
  username: string | null;
  website?: string | null;
  avatar_url?: string | null;
}
