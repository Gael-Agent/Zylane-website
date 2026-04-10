export type Worker = {
  id: string;
  name: string;
  skills: string[]; // 'femmes' | 'hommes' | 'enfants'
  is_active: boolean;
  email: string | null;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  category: string; // 'femmes' | 'hommes' | 'enfants' | 'barbe'
  duration_minutes: number;
  price_display: string;
  is_active: boolean;
};

export type Schedule = {
  id: string;
  worker_id: string;
  day_of_week: number; // 0=Sun, 6=Sat
  start_time: string; // HH:MM:SS
  end_time: string;
};

export type Booking = {
  id: string;
  worker_id: string;
  service_id: string;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  client_name: string;
  client_contact: string;
  status: "confirmed" | "cancelled";
  cancel_token: string;
  created_at: string;
};

export type TimeSlot = {
  start: string; // HH:MM
  end: string;
  worker_id: string;
  worker_name: string;
};
