import * as React from 'react';
import { MathfieldElement } from 'mathlive';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement> & {
        ref?: React.Ref<MathfieldElement>;
        onInput?: (e: React.FormEvent<MathfieldElement>) => void;
      };
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement> & {
        ref?: React.Ref<MathfieldElement>;
        onInput?: (e: React.FormEvent<MathfieldElement>) => void;
      };
    }
  }
}
