export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  iqScore: number;
  dealType: 'Fix & Flip' | 'BRRRR' | 'Both';
  description: string;
  images: string[];
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface DealAnalysis {
  purchasePrice: number;
  rehabCost: number;
  arv: number;
  holdingCosts: number;
  roi: number;
}

export interface AdvisorRequest {
  id: string;
  propertyId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
  property: Property;
  user: User;
}