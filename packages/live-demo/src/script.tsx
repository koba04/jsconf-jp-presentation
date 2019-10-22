import React, { useState, useEffect } from 'react';
import { ReactJSON } from './';

const App = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount(c => c < 10 ? c + 1 : c);
    }, 100);
  }, [count]);
  return (
    <>
      <text>{count}</text>
      <text>Hello!!!</text>
    </>
  );
};

const rootContainer = ReactJSON.createRootContainer();
ReactJSON.render(
  <App />,
  rootContainer
);