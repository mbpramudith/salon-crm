export interface Salon {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  salonId: string | null;
  salon: Salon | null;
}

export interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}