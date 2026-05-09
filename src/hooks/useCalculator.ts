import { useState } from 'react';
import axios from 'axios';
import { calculatorAPI } from '../api/calculator';
import type { CalculationResult, CalculatorPayload, NotificationState } from '../types';
import type { NotificationType } from '../components/ui/Notification';

export const useCalculator = () => {
  const [expression, setExpression] = useState('x * sin(x)');
  const [matrixData, setMatrixData] = useState<string[][]>([['1', '2'], ['3', '4']]);
  const [matrixSize, setMatrixSize] = useState(2);
  const [operation, setOperation] = useState('integral');
  const [variable, setVariable] = useState('x');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [expansionPoint, setExpansionPoint] = useState('0');
  const [seriesOrder, setSeriesOrder] = useState(6);
  const [systemEquations, setSystemEquations] = useState<string[]>(['x + y = 3', 'x - y = 1']);
  const [systemVars, setSystemVars] = useState('x,y');

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const clearNotification = () => setNotification(null);

  const clearResult = () => {
    setResult(null);
    setCopied(false);
  };

  const handleCalculate = async () => {
    setLoading(true);
    clearResult();
    try {
      const payload: CalculatorPayload = {
        operation,
        expression: operation.startsWith('matrix_') ? matrixData : expression,
        variable
      };
      
      if (operation === 'integral' && lowerLimit && upperLimit) {
        payload.lower_limit = lowerLimit;
        payload.upper_limit = upperLimit;
      }
      
      if (operation === 'taylor_series') {
        payload.expansion_point = expansionPoint;
        payload.series_order = seriesOrder;
      }

      if (operation === 'solve_system') {
        payload.equations = systemEquations.filter(e => e.trim() !== '');
        payload.variables = systemVars;
        payload.expression = '';
      }
      
      const data = await calculatorAPI.calculate(payload);
      setResult(data);
      showNotification('Cálculo finalizado con éxito', 'success');
    } catch (error: unknown) {
      console.error(error);
      let msg = 'Error al calcular. Verifica el formato o el servidor.';
      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.detail || msg;
      }
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.final_result);
      setCopied(true);
      showNotification('Resultado copiado al portapapeles', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMatrixSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = parseInt(e.target.value);
    setMatrixSize(s);
    setMatrixData(Array(s).fill(0).map(() => Array(s).fill('0')));
  };

  const setOpAndClearResult = (op: string) => {
    setOperation(op);
    clearResult();
  };

  return {
    state: {
      expression, matrixData, matrixSize, operation, loading, result, 
      notification, copied, lowerLimit, upperLimit, expansionPoint, seriesOrder, variable,
      systemEquations, systemVars
    },
    actions: {
      setExpression, setMatrixData, setMatrixSize, setOperation: setOpAndClearResult,
      setLowerLimit, setUpperLimit, setExpansionPoint, setSeriesOrder, setVariable,
      setSystemEquations, setSystemVars,
      handleCalculate, copyToClipboard, handleMatrixSizeChange, clearNotification, clearResult
    }
  };
};
