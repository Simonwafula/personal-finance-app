import { api as apiClient } from './client';

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  target_date: string | null;
  created_at: string;
  updated_at: string;
  linked_account: number | null;
  linked_account_name?: string;
  description: string;
  emoji: string;
  progress_percentage: number;
  remaining_amount: string;
  contributions?: GoalContribution[];
  days_remaining: number | null;
  monthly_target: number;
  total_from_transactions: number;
  interest_rate: number;
  projected_value: number;
}

export interface GoalContribution {
  id: number;
  amount: string;
  contribution_type: 'MANUAL' | 'AUTOMATIC';
  date: string;
  notes: string;
  created_at: string;
  transaction: number | null;
  transaction_description: string | null;
}

export interface SavingsSummary {
  total_goals: number;
  total_target: number;
  total_saved: number;
  total_remaining: number;
  average_progress: number;
}

export interface CreateGoalData {
  name: string;
  target_amount: number | string;
  current_amount?: number | string;
  target_date?: string;
  description?: string;
  emoji?: string;
  interest_rate?: number | string;
}

export interface CreateContributionData {
  amount: number | string;
  contribution_type: 'MANUAL' | 'AUTOMATIC';
  date: string;
  notes?: string;
}

// Get all savings goals
export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  const response = await apiClient.get('/api/savings/goals/');
  return response.data;
};

// Get single savings goal
export const getSavingsGoal = async (id: number): Promise<SavingsGoal> => {
  const response = await apiClient.get(`/api/savings/goals/${id}/`);
  return response.data;
};

// Create savings goal
export const createSavingsGoal = async (data: CreateGoalData): Promise<SavingsGoal> => {
  const response = await apiClient.post('/api/savings/goals/', data);
  return response.data;
};

// Update savings goal
export const updateSavingsGoal = async (id: number, data: Partial<CreateGoalData>): Promise<SavingsGoal> => {
  const response = await apiClient.patch(`/api/savings/goals/${id}/`, data);
  return response.data;
};

// Delete savings goal
export const deleteSavingsGoal = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/savings/goals/${id}/`);
};

// Add contribution to goal
export const addContribution = async (goalId: number, data: CreateContributionData): Promise<SavingsGoal> => {
  const response = await apiClient.post(`/api/savings/goals/${goalId}/contribute/`, data);
  return response.data;
};

// Get savings summary
export const getSavingsSummary = async (): Promise<SavingsSummary> => {
  const response = await apiClient.get('/api/savings/goals/summary/');
  return response.data;
};
