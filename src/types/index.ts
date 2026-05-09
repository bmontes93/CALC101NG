import type { NotificationType } from '../components/ui/Notification';

export interface CalculationStep {
  title: string;
  description: string;
  resulting_expression: string;
  steps: CalculationStep[];
  sub_assignments: Record<string, string> | null;
}

export interface CalculationResult {
  status: string;
  operation: string;
  original_expression: string;
  final_result: string;
  steps: CalculationStep[];
  plot_data?: PlotData;
}

export interface PlotData {
  fn: string;
  operator: string;
  roots: number[];
  type: 'equation' | 'inequality';
}

export interface NotificationState {
  message: string;
  type: NotificationType;
}

export interface CalculatorPayload {
  operation: string;
  expression: string | string[][];
  variable: string;
  lower_limit?: string;
  upper_limit?: string;
  expansion_point?: string;
  series_order?: number;
  equations?: string[];
  variables?: string;
}
