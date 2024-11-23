export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}


export type Property = {
  id: string;
  title: string;
  address: string;
  price: number;
  description: string | null;
  images: string[];
  iq_score: number;
  user_id: string;
  created_at: string;
  deal_type?: "Fix & Flip" | "BRRRR" | "Both";
};


export interface DealAnalysis {
  purchase_price: number;
  rehab_cost: number;
  arv: number;
  holding_costs: number;
  roi: number;
}

export interface AdvisorRequest {
  id: string;
  property_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  response?: string;
  created_at: string;
  responded_at?: string;
  advisor_id?: string;
  properties?: Property;
  profiles?: User;
  property?:{
    title: string;
  };
  user?:{
    name: string;
  };
}