import React, { useEffect, useRef } from 'react';
import { MathfieldElement } from 'mathlive';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const MathInput: React.FC<MathInputProps> = ({ value, onChange }) => {
  const mfRef = useRef<MathfieldElement>(null);

  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.value = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<MathfieldElement>) => {
    const asciiValue = e.currentTarget.getValue('ascii-math');
    onChange(asciiValue);
  };

  return (
    <div className="math-input-container">
      <math-field
        ref={mfRef}
        onInput={handleInput}
        style={{ width: '100%' }}
      />
    </div>
  );
};
