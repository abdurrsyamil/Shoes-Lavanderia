export interface Feature {
  id?: number;
  icon_name: string;
  title: string;
  description: string;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  price_label: string;
  price_value: string;
}

export interface Location {
  id?: number;
  city: string;
  store_name: string;
  operating_hours: string;
  whatsapp_url: string;
  gmaps_url: string;
}

export interface Promo {
  id?: number;
  status: string;
  date: string;
  title: string;
  benefits: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}
