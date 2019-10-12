import React, { useState, useEffect } from 'react';
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

const fizzbuzz = (n: number) => {
  if (n % 15 === 0) {
    return "FizzBuzz";
  } else if (n % 3 === 0) {
    return  "Fizz";
  } else if (n % 5 === 0) {
    return "Buzz";
  } else {
    return n.toString();
  }
}

const App = () => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    setTimeout(() => {
      if (count < 15) {
        setCount(count + 1);
      }
    }, 50);
  }, [count]);
  return <alex>{fizzbuzz(count)}</alex>;
}

ReactVoice.render(
  <App />
, {});