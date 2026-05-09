import type React from 'react';

interface MatrixInputProps {
  rows: number;
  cols: number;
  value: string[][];
  onChange: (matrix: string[][]) => void;
}

export const MatrixInput = ({ rows, cols, value, onChange }: MatrixInputProps) => {
  const handleChange = (r: number, c: number, val: string) => {
    const newMatrix = value.map((row) => [...row]);
    newMatrix[r][c] = val;
    onChange(newMatrix);
  };

  const handlePaste = (r: number, c: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const hasGrid = /[\t\r\n,;]/.test(text);
    if (!hasGrid) return;

    const lines = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0);

    const cells = lines.map((line) =>
      line
        .split(/\t|,|;/g)
        .map((x) => x.trim())
        .filter((x) => x.length > 0)
    );

    if (cells.length === 0 || (cells.length === 1 && cells[0].length === 1)) return;

    e.preventDefault();
    const next = value.map((row) => [...row]);

    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        const rr = r + i;
        const cc = c + j;
        if (rr < rows && cc < cols) next[rr][cc] = cells[i][j];
      }
    }

    onChange(next);
  };

  return (
    <div 
      className="matrix-grid" 
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        maxWidth: 'max-content',
        margin: '0 auto 2rem auto'
      }}
    >
      {value.map((row, r) => (
        row.map((cell, c) => (
          <input
            key={`${r}-${c}`}
            type="text"
            className="matrix-cell"
            value={cell}
            onChange={(e) => handleChange(r, c, e.target.value)}
            onPaste={handlePaste(r, c)}
          />
        ))
      ))}
    </div>
  );
};
