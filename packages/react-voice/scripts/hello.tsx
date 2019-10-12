import React from 'react';
import { ReactVoice } from '../src';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'alex': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'victoria': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'kyoko': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

ReactVoice.render(
  <>
    <alex>Hello</alex>
    <victoria>JSConf JP</victoria>
    <kyoko>こんにちは みなさん</kyoko>
  </>
, {});