import { useEffect, useRef } from 'react';
import functionPlot from 'function-plot';
import type { PlotData } from '../../types';

interface GraphPlotProps {
  plotData: PlotData;
  variable?: string;
}

/** Evalúa la función fn en el punto x usando Function() de forma segura */
function evalFn(fn: string, x: number): number {
  try {
    // Convertir sintaxis function-plot (^) a JS (**)
    const jsExpr = fn.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    const f = new Function(
      'x', 'sqrt', 'sin', 'cos', 'tan', 'exp', 'log', 'abs',
      `return (${jsExpr});`
    );
    return f(x, Math.sqrt, Math.sin, Math.cos, Math.tan, Math.exp, Math.log, Math.abs);
  } catch {
    return 0;
  }
}

/** Devuelve los subintervalos donde la inecuación se satisface */
function getInequalityIntervals(
  roots: number[],
  fn: string,
  operator: string,
  padding = 6
): [number, number][] {
  const sorted = [...roots].sort((a, b) => a - b);
  const boundaries = [-padding, ...sorted, padding];
  const intervals: [number, number][] = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const mid = (boundaries[i] + boundaries[i + 1]) / 2;
    const val = evalFn(fn, mid);
    const ok =
      (operator === '<'  && val < 0)  ||
      (operator === '<=' && val <= 0) ||
      (operator === '>'  && val > 0)  ||
      (operator === '>=' && val >= 0);
    if (ok) intervals.push([boundaries[i], boundaries[i + 1]]);
  }
  return intervals;
}

export const GraphPlot: React.FC<GraphPlotProps> = ({ plotData, variable = 'x' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !plotData?.fn) return;

    const { fn, operator, roots, type } = plotData;
    const padding = 6;

    // Calcular dominio de visualización
    const rootsOrZero = roots.length ? roots : [0];
    const minRoot = Math.min(...rootsOrZero);
    const maxRoot = Math.max(...rootsOrZero);
    const margin = Math.max(2, (maxRoot - minRoot) * 0.6);
    const xDomain: [number, number] = [minRoot - margin, maxRoot + margin];

    // Serie principal: la curva y = f(x)
    const dataSeries: object[] = [
      {
        fn,
        color: '#0ea5e9',
        graphType: 'polyline',
      },
    ];

    // Para inecuaciones: rellenar los intervalos válidos
    if (type === 'inequality' && roots.length > 0) {
      const intervals = getInequalityIntervals(roots, fn, operator, padding);
      intervals.forEach(([a, b]) => {
        dataSeries.push({
          fn,
          range: [a, b],
          closed: true,
          color: 'rgba(14,165,233,0.15)',
          graphType: 'polyline',
        });
      });
    }

    // Para ecuaciones cuadráticas: marcar las raíces como puntos
    if (type === 'equation' && roots.length > 0) {
      dataSeries.push({
        points: roots.map(r => [r, 0]),
        fnType: 'points',
        graphType: 'scatter',
        color: '#f43f5e',
      });
    }

    // Anotaciones: líneas verticales en las raíces
    const annotations = roots.map(r => ({
      x: r,
      text: `${variable}=${Number.isInteger(r) ? r : r.toFixed(2)}`,
    }));

    try {
      const width = ref.current.offsetWidth || 560;
      functionPlot({
        target: ref.current,
        width,
        height: 280,
        grid: true,
        xAxis: { domain: xDomain, label: variable },
        yAxis: { label: 'y' },
        data: dataSeries,
        annotations,
      });
    } catch (err) {
      console.error('GraphPlot render error:', err);
    }
  }, [plotData, variable]);

  return (
    <div
      className="graph-wrapper glass"
      style={{
        marginTop: '1.5rem',
        borderRadius: '12px',
        overflow: 'hidden',
        padding: '1rem 0.5rem 0.5rem',
      }}
    >
      <p
        style={{
          textAlign: 'center',
          opacity: 0.5,
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '0.5rem',
        }}
      >
        Gráfica — {plotData.type === 'inequality' ? 'Región solución resaltada' : 'Raíces marcadas'}
      </p>
      <div ref={ref} style={{ width: '100%' }} />
    </div>
  );
};

export default GraphPlot;
