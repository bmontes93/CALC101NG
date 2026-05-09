import { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CalculationStep } from '../../types';

const StepItem = ({ step, index }: { step: CalculationStep; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  const renderMath = (tex: string) => {
    try {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(tex, { throwOnError: false }),
          }}
        />
      );
    } catch {
      return <span>{tex}</span>;
    }
  };

  // Renderiza texto que mezcla prosa normal con fragmentos LaTeX entre $...$
  const renderMixedText = (text: string) => {
    if (!text) return null;
    // Divide por $...$ capturando el contenido dentro
    const parts = text.split(/\$([^$]+)\$/g);
    return (
      <>
        {parts.map((part, i) =>
          // Los índices impares son el contenido LaTeX capturado
          i % 2 === 1 ? (
            <span key={i}>
              {renderMath(part)}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="accordion-item glass animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="premium-gradient" style={{ fontWeight: 'bold' }}>Paso {index + 1}</span>
          <span>{step.title}</span>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      
      {isOpen && (
        <div className="accordion-content">
          <p style={{ marginBottom: '1rem', color: 'hsla(var(--foreground), 0.8)', lineHeight: '1.7' }}>
            {renderMixedText(step.description)}
          </p>
          
          <div style={{ 
            padding: '1rem', 
            background: 'hsla(var(--accent), 0.3)', 
            borderRadius: 'var(--radius)',
            textAlign: 'center',
            fontSize: '1.2rem'
          }}>
            {renderMath(step.resulting_expression)}
          </div>

          {step.sub_assignments && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Asignaciones:</strong>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {Object.entries(step.sub_assignments).map(([key, val]) => (
                  <div key={key} className="glass" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {renderMath(`${key} = ${val}`)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.steps && step.steps.length > 0 && (
            <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid hsla(var(--primary), 0.3)' }}>
              {step.steps.map((subStep, i) => (
                <StepItem key={i} step={subStep} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const StepList = ({ steps }: { steps: CalculationStep[] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', opacity: 0.7 }}>Procedimiento Paso a Paso</h2>
      {steps.map((step, i) => (
        <StepItem key={i} step={step} index={i} />
      ))}
    </div>
  );
};
