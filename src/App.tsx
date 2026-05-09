import { useMemo, useState } from 'react';
import { MathInput } from './components/ui/MathInput';
import { MatrixInput } from './components/calculator/MatrixInput';
import { StepList } from './components/calculator/StepList';
import { GraphPlot } from './components/calculator/GraphPlot';
import { Notification, NotificationContainer } from './components/ui/Notification';
import { Calculator, Grid3X3, Sigma, Send, Loader2, Copy, Check, Equal, Layers } from 'lucide-react';
import katex from 'katex';
import { useCalculator } from './hooks/useCalculator';

function App() {
  const { state, actions } = useCalculator();
  const [selectedExample, setSelectedExample] = useState('');

  type ExpressionExample = {
    id: string;
    label: string;
    expression: string;
    variable?: string;
    lowerLimit?: string;
    upperLimit?: string;
    expansionPoint?: string;
    seriesOrder?: number;
  };

  type MatrixExample = {
    id: string;
    label: string;
    matrixSize: number;
    matrixData: string[][];
  };

  type Example = ExpressionExample | MatrixExample;

  const operationInfo = useMemo(() => {
    return {
      integral: {
        title: 'Integral',
        hint: 'Ej: x*sin(x), (x^2 + 1)/(x-1)',
      },
      derivative: {
        title: 'Derivada',
        hint: 'Ej: x^3 + 2x, x*sin(x)',
      },
      taylor_series: {
        title: 'Serie de Taylor',
        hint: 'Ej: sin(x), exp(x), 1/(1-x)',
      },
      matrix_determinant: {
        title: 'Determinante',
        hint: 'Pega valores con tabulaciones o comas, una fila por línea',
      },
      matrix_inverse: {
        title: 'Inversa',
        hint: 'Matriz cuadrada con determinante distinto de 0',
      },
      solve_equation: {
        title: 'Ecuación / Inecuación',
        hint: 'Usa =, <, >, <= o >=. Ej: x^2 - 5*x + 6 = 0  |  x^2 - 4 < 0',
      },
      solve_system: {
        title: 'Sistema de Ecuaciones',
        hint: 'Una ecuación por fila con =. Ej: x + y = 3',
      },
    } as const;
  }, []);

  const examplesByOperation = useMemo<Record<string, Example[]>>(() => {
    return {
      integral: [
        { id: 'int-1', label: '∫ x·sin(x) dx', expression: 'x*sin(x)', variable: 'x' },
        { id: 'int-2', label: '∫ x^2 dx', expression: 'x^2', variable: 'x' },
        { id: 'int-3', label: '∫₀¹ x dx', expression: 'x', variable: 'x', lowerLimit: '0', upperLimit: '1' },
      ],
      derivative: [
        { id: 'der-1', label: 'd/dx (x^3 + 2x)', expression: 'x^3 + 2x', variable: 'x' },
        { id: 'der-2', label: 'd/dx (x·sin(x))', expression: 'x*sin(x)', variable: 'x' },
      ],
      taylor_series: [
        { id: 'tay-1', label: 'sin(x) (orden 6)', expression: 'sin(x)', variable: 'x', expansionPoint: '0', seriesOrder: 6 },
        { id: 'tay-2', label: 'exp(x) (orden 6)', expression: 'exp(x)', variable: 'x', expansionPoint: '0', seriesOrder: 6 },
        { id: 'tay-3', label: '1/(1-x) (orden 6)', expression: '1/(1-x)', variable: 'x', expansionPoint: '0', seriesOrder: 6 },
      ],
      matrix_determinant: [
        { id: 'mat-det-1', label: '2x2 (1 2 / 3 4)', matrixSize: 2, matrixData: [['1', '2'], ['3', '4']] },
        { id: 'mat-det-2', label: '3x3 (ejemplo)', matrixSize: 3, matrixData: [['1', '2', '3'], ['0', '1', '4'], ['5', '6', '0']] },
      ],
      matrix_inverse: [
        { id: 'mat-inv-1', label: '2x2 invertible', matrixSize: 2, matrixData: [['1', '2'], ['3', '4']] },
        { id: 'mat-inv-2', label: '3x3 invertible', matrixSize: 3, matrixData: [['2', '0', '1'], ['1', '1', '0'], ['0', '3', '1']] },
      ],
      solve_equation: [
        { id: 'eq-1', label: 'x² - 5x + 6 = 0', expression: 'x^2 - 5*x + 6 = 0', variable: 'x' },
        { id: 'eq-2', label: '2x + 4 = 0', expression: '2*x + 4 = 0', variable: 'x' },
        { id: 'eq-3', label: 'x² - 4 < 0', expression: 'x^2 - 4 < 0', variable: 'x' },
        { id: 'eq-4', label: '2x - 3 >= 1', expression: '2*x - 3 >= 1', variable: 'x' },
      ],
      solve_system: [],
    };
  }, []);

  const currentInfo = operationInfo[state.operation as keyof typeof operationInfo];
  const currentExamples = examplesByOperation[state.operation] ?? [];

  const isExpressionExample = (ex: Example): ex is ExpressionExample => 'expression' in ex;
  const isMatrixExample = (ex: Example): ex is MatrixExample => 'matrixData' in ex;

  const applyExample = (exampleId: string) => {
    const example = currentExamples.find((e) => e.id === exampleId);
    if (!example) return;

    actions.clearResult();

    if (isExpressionExample(example)) {
      actions.setExpression(example.expression);
      actions.setVariable(example.variable ?? 'x');
      actions.setLowerLimit(example.lowerLimit ?? '');
      actions.setUpperLimit(example.upperLimit ?? '');
      actions.setExpansionPoint(example.expansionPoint ?? '0');
      actions.setSeriesOrder(example.seriesOrder ?? 6);
    }

    if (isMatrixExample(example)) {
      actions.setMatrixSize(example.matrixSize);
      actions.setMatrixData(example.matrixData);
    }
  };

  const renderMath = (tex: string) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(tex, { throwOnError: false }),
        }}
      />
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="premium-gradient" style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>Calc101</h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Cálculo simbólico avanzado con explicaciones paso a paso</p>
      </header>

      <main className="workspace animate-fade-in">
        <section className="glass workspace-panel">
          <nav className="nav-tabs">
            {[
              { id: 'integral', icon: <Sigma size={18} />, label: 'Integral' },
              { id: 'derivative', icon: <Calculator size={18} />, label: 'Derivada' },
              { id: 'taylor_series', icon: <Calculator size={18} />, label: 'Serie Taylor' },
              { id: 'matrix_determinant', icon: <Grid3X3 size={18} />, label: 'Determinante' },
              { id: 'matrix_inverse', icon: <Grid3X3 size={18} />, label: 'Inversa' },
              { id: 'solve_equation', icon: <Equal size={18} />, label: 'Ecuación' },
              { id: 'solve_system', icon: <Layers size={18} />, label: 'Sistema' },
            ].map((op) => (
              <button 
                key={op.id}
                onClick={() => { actions.setOperation(op.id); setSelectedExample(''); }}
                className={`nav-tab-btn ${state.operation === op.id ? 'active' : ''}`}
              >
                {op.icon} {op.label}
              </button>
            ))}
          </nav>

          <div className="panel-header">
            <div>
              <h2 className="panel-title">{currentInfo?.title ?? 'Operación'}</h2>
              <p className="panel-subtitle">{currentInfo?.hint ?? ''}</p>
            </div>

            <div className="panel-toolbar">
              {currentExamples.length > 0 && (
                <div className="field">
                  <label className="field-label">Ejemplos</label>
                  <select
                    className="select-input"
                    value={selectedExample}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedExample(v);
                      if (v) applyExample(v);
                    }}
                  >
                    <option value="">Selecciona…</option>
                    {currentExamples.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!state.operation.startsWith('matrix_') && state.operation !== 'solve_system' && (
                <div className="field field-small">
                  <label className="field-label">Variable</label>
                  <input
                    className="text-input"
                    value={state.variable}
                    onChange={(e) => actions.setVariable(e.target.value)}
                    placeholder="x"
                    inputMode="text"
                  />
                </div>
              )}
            </div>
          </div>

          {state.operation === 'solve_system' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="controls-row" style={{ marginTop: 0, marginBottom: 0 }}>
                <div className="field">
                  <label className="field-label">Variables (separadas por coma)</label>
                  <input
                    className="text-input"
                    value={state.systemVars}
                    onChange={(e) => actions.setSystemVars(e.target.value)}
                    placeholder="x,y"
                  />
                </div>
                <div className="field" style={{ justifyContent: 'flex-end' }}>
                  <label className="field-label">Número de ecuaciones</label>
                  <select
                    className="select-input"
                    value={state.systemEquations.length}
                    onChange={(e) => {
                      const n = parseInt(e.target.value);
                      const current = state.systemEquations;
                      const next = Array(n).fill('').map((_, i) => current[i] ?? '');
                      actions.setSystemEquations(next);
                    }}
                  >
                    {[2, 3, 4].map(n => <option key={n} value={n}>{n} ecuaciones</option>)}
                  </select>
                </div>
              </div>
              {state.systemEquations.map((eq, i) => (
                <div key={i} className="field">
                  <label className="field-label">Ecuación {i + 1}</label>
                  <input
                    className="text-input"
                    value={eq}
                    onChange={(e) => {
                      const next = [...state.systemEquations];
                      next[i] = e.target.value;
                      actions.setSystemEquations(next);
                    }}
                    placeholder={`ej: ${i === 0 ? 'x + y = 3' : 'x - y = 1'}`}
                  />
                </div>
              ))}
            </div>
          ) : state.operation.startsWith('matrix_') ? (
            <div style={{ textAlign: 'center' }}>
              <div className="field field-inline" style={{ justifyContent: 'center' }}>
                <label className="field-label">Tamaño</label>
                <select 
                  value={state.matrixSize} 
                  onChange={actions.handleMatrixSizeChange}
                  className="select-input"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}x{n}</option>)}
                </select>
              </div>
              <MatrixInput
                rows={state.matrixSize}
                cols={state.matrixSize}
                value={state.matrixData}
                onChange={actions.setMatrixData}
              />
            </div>
          ) : state.operation === 'solve_equation' ? (
            <div className="math-input-wrapper-premium" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="math-symbol-label" style={{ fontSize: '1.5rem' }}>
                  {renderMath('f(x)')}
                </div>
                <div className="math-field-container">
                  <MathInput value={state.expression} onChange={actions.setExpression} />
                </div>
              </div>
              <p style={{ opacity: 0.5, fontSize: '0.82rem', textAlign: 'center' }}>
                Escribe la ecuación o inecuación completa usando el teclado matemático.
                Ej: <code>x^2-5x+6=0</code> &nbsp;&bull;&nbsp; <code>x^2-4&lt;0</code> &nbsp;&bull;&nbsp; <code>2x+1\ge5</code>
              </p>
            </div>
          ) : (
            <div className="math-input-wrapper-premium">
              <div className="math-symbol-label">
                {state.operation === 'integral' ? renderMath('\\int') : state.operation === 'taylor_series' ? renderMath('T') : renderMath('\\frac{d}{d' + (state.variable || 'x') + '}')}
              </div>
              <div className="math-field-container">
                <MathInput value={state.expression} onChange={actions.setExpression} />
              </div>
              {state.operation === 'integral' && (
                <div className="math-symbol-label">
                  {renderMath('d' + (state.variable || 'x'))}
                </div>
              )}
            </div>
          )}

          {state.operation === 'integral' && (
            <div className="controls-row">
              <div className="field">
                <label className="field-label">Límite inferior (opcional)</label>
                <input
                  type="text"
                  value={state.lowerLimit}
                  onChange={(e) => actions.setLowerLimit(e.target.value)}
                  placeholder="ej: 0"
                  className="text-input"
                  inputMode="text"
                />
              </div>
              <div className="field">
                <label className="field-label">Límite superior (opcional)</label>
                <input
                  type="text"
                  value={state.upperLimit}
                  onChange={(e) => actions.setUpperLimit(e.target.value)}
                  placeholder="ej: 1"
                  className="text-input"
                  inputMode="text"
                />
              </div>
            </div>
          )}

          {state.operation === 'taylor_series' && (
            <div className="controls-row">
              <div className="field">
                <label className="field-label">Punto de expansión</label>
                <input
                  type="text"
                  value={state.expansionPoint}
                  onChange={(e) => actions.setExpansionPoint(e.target.value)}
                  placeholder="ej: 0"
                  className="text-input"
                  inputMode="text"
                />
              </div>
              <div className="field">
                <label className="field-label">Orden</label>
                <select
                  value={state.seriesOrder}
                  onChange={(e) => actions.setSeriesOrder(Number(e.target.value))}
                  className="select-input"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="actions-row">
            <button
              type="button"
              className="secondary-btn"
              onClick={actions.clearResult}
              disabled={state.loading}
            >
              Limpiar resultado
            </button>
            <button 
              onClick={actions.handleCalculate}
              disabled={state.loading}
              className="calculate-btn-premium"
            >
              {state.loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {state.loading ? 'Procesando Motor CAS...' : 'Ver Procedimiento Paso a Paso'}
            </button>
          </div>
        </section>

        <aside className="glass workspace-panel workspace-help">
          <h3 className="panel-title">Formato rápido</h3>
          <ul className="help-list">
            <li>Multiplicación: 2*x, x*sin(x)</li>
            <li>Potencias: x^2</li>
            <li>Funciones: sin(x), cos(x), exp(x)</li>
            <li>Fracciones: (x^2+1)/(x-1)</li>
            <li>Ecuaciones: x^2 - 4 = 0</li>
            <li>Inecuaciones: x^2 - 4 &lt; 0, 2x &gt;= 1</li>
            <li>Matrices: pega desde Excel/Sheets (tabs o comas)</li>
          </ul>
        </aside>
      </main>

      {state.result && (
        <section className="animate-fade-in" style={{ marginTop: '4rem' }}>
          <div className="glass result-card">
            <button onClick={actions.copyToClipboard} className="copy-btn">
              {state.copied ? <Check size={16} /> : <Copy size={16} />}
              {state.copied ? 'Copiado' : 'Copiar'}
            </button>
            <h3 style={{ opacity: 0.5, marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em' }}>Resultado Final</h3>
            
            <div className="result-header-container">
              {state.result.original_expression && (
                <div className="original-expr-display">
                  {renderMath(state.result.original_expression)}
                </div>
              )}
              <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>=</div>
              <div style={{ fontSize: '2.5rem', wordBreak: 'break-all' }}>
                {renderMath(state.result.final_result)}
              </div>
            </div>
          </div>

          <StepList steps={state.result.steps} />

          {state.result.plot_data && (
            <GraphPlot
              plotData={state.result.plot_data}
              variable={state.variable || 'x'}
            />
          )}
        </section>
      )}

      <NotificationContainer>
        {state.notification && (
          <Notification 
            message={state.notification.message}
            type={state.notification.type}
            onClose={actions.clearNotification}
          />
        )}
      </NotificationContainer>
    </div>
  );
}

export default App;
