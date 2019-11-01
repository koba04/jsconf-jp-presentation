import React, { useState, useEffect } from "react";
import { ReactJSON } from "./";
import readline from "readline";

const askQuestion = (): Promise<string> => {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("input a text: ", (text: string) => {
      if (text == null) return;
      resolve(text);
      rl.close();
    });
  });
};

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  /*
  useEffect(() => {
    setTimeout(() => {
      setCount(c => (c < 10 ? c + 1 : c));
    }, 100);
  }, [count]);
  */

  useEffect(() => {
    (async () => {
      const answer = await askQuestion();
      console.log("answer is ", answer);
      setName(answer);
    })();
  }, [name]);
  return (
    <>
      <directory name="src">
        <file name="index.js">const hello = &ldquo;hello&ldquo;;</file>
        <file name="log.txt">{count}</file>
      </directory>
      <directory name="foo">
        {name && <file name={name}>{name}</file>}
      </directory>
      <file name="README.md"># Hello File Renderer</file>
    </>
  );
};

ReactJSON.render(<App />, "./hoge");
