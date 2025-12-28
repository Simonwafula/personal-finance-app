import { api as apiClient } from './client';

export interface Investment {
  id: number;
  name: string;
  symbol: string;
  investment_type: string;
  investment_type_display: string;
  purchase_date: string;
  purchase_price: string;
  quantity: string;
  purchase_fees: string;
  current_price: string;
  last_updated: string;
  interest_rate: string;
  maturity_date: string | null;
  // Bond fields
  bond_type: string;
  bond_type_display: string;
  payment_frequency: string;
  payment_frequency_display: string;
  next_payment_date: string | null;
  tax_rate: string;
  face_value: string | null;
  // Real estate fields
  monthly_rent: string;
  monthly_costs: string;
  property_tax_annual: string;
  occupancy_status: string;
  occupancy_status_display: string;
  // Insurance fields
  sum_assured: string | null;
  premium_frequency: string;
  premium_amount: string;
  surrender_value: string | null;
  // SACCO fields
  dividend_rate: string;
  loan_interest_rebate: string;
  // Common fields
  platform: string;
  notes: string;
  status: 'ACTIVE' | 'SOLD' | 'MATURED';
  status_display: string;
  total_invested: number;
  current_value: number;
  gain_loss: number;
  gain_loss_percentage: number;
  days_held: number;
  annualized_return: number;
  annual_income: number;
  net_rental_yield: number;
  transactions?: InvestmentTransaction[];
  created_at: string;
  updated_at: string;
}

export interface InvestmentTransaction {
  id: number;
  transaction_type: 'BUY' | 'SELL' | 'DIVIDEND' | 'INTEREST' | 'BONUS' | 'SPLIT' | 'FEE';
  date: string;
  quantity: string;
  price_per_unit: string;
  total_amount: string;
  fees: string;
  notes: string;
  created_at: string;
}

export interface InvestmentSummary {
  total_invested: number;
  total_current_value: number;
  total_gain_loss: number;
  total_gain_loss_percentage: number;
  total_annual_income: number;
  investment_count: number;
  by_type: Record<string, {
    count: number;
    invested: number;
    current_value: number;
    gain_loss: number;
  }>;
}

export interface CreateInvestmentData {
  name: string;
  symbol?: string;
  investment_type: string;
  purchase_date: string;
  purchase_price: number | string;
  quantity?: number | string;
  purchase_fees?: number | string;
  current_price: number | string;
  interest_rate?: number | string;
  maturity_date?: string;
  // Bond fields
  bond_type?: string;
  payment_frequency?: string;
  next_payment_date?: string;
  tax_rate?: number | string;
  face_value?: number | string;
  // Real estate fields
  monthly_rent?: number | string;
  monthly_costs?: number | string;
  property_tax_annual?: number | string;
  occupancy_status?: string;
  // Insurance fields
  sum_assured?: number | string;
  premium_frequency?: string;
  premium_amount?: number | string;
  surrender_value?: number | string;
  // SACCO fields
  dividend_rate?: number | string;
  loan_interest_rebate?: number | string;
  // Common
  platform?: string;
  notes?: string;
}

export interface CreateTransactionData {
  transaction_type: string;
  date: string;
  quantity?: number | string;
  price_per_unit?: number | string;
  total_amount: number | string;
  fees?: number | string;
  notes?: string;
}

// Get all investments
export const getInvestments = async (): Promise<Investment[]> => {
  const response = await apiClient.get('/api/investments/investments/');
  return response.data;
};

// Get single investment
export const getInvestment = async (id: number): Promise<Investment> => {
  const response = await apiClient.get(`/api/investments/investments/${id}/`);
  return response.data;
};

// Create investment
export const createInvestment = async (data: CreateInvestmentData): Promise<Investment> => {
  const response = await apiClient.post('/api/investments/investments/', data);
  return response.data;
};

// Update investment
export const updateInvestment = async (id: number, data: Partial<CreateInvestmentData>): Promise<Investment> => {
  const response = await apiClient.patch(`/api/investments/investments/${id}/`, data);
  return response.data;
};

// Delete investment
export const deleteInvestment = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/investments/investments/${id}/`);
};

// Get investment summary
export const getInvestmentSummary = async (): Promise<InvestmentSummary> => {
  const response = await apiClient.get('/api/investments/investments/summary/');
  return response.data;
};

// Update investment price
export const updateInvestmentPrice = async (id: number, currentPrice: number | string): Promise<Investment> => {
  const response = await apiClient.post(`/api/investments/investments/${id}/update_price/`, {
    current_price: currentPrice
  });
  return response.data;
};

// Add transaction to investment
export const addInvestmentTransaction = async (id: number, data: CreateTransactionData): Promise<Investment> => {
  const response = await apiClient.post(`/api/investments/investments/${id}/add_transaction/`, data);
  return response.data;
};
