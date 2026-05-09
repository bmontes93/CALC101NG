import axios from 'axios';
import type { CalculatorPayload, CalculationResult } from '../types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const calculatorAPI = {
  calculate: async (payload: CalculatorPayload): Promise<CalculationResult> => {
    const response = await client.post('/api/v1/calculate', payload);
    return response.data;
  }
};
