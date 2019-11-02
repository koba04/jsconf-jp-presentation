import React, { useState, useEffect } from "react";
import { ReactFS } from "../index";
import path from "path";
import { tmpdir } from "os";
import { rmdirSync, readFileSync, statSync, existsSync } from "fs";

const waitEffect = () => new Promise(r => setTimeout(r, 0));

describe("ReactFS", () => {
  const tempDir = path.join(tmpdir(), "react-fs");
  console.log("tempDir is ", tempDir);
  afterEach(() => {
    rmdirSync(tempDir, { recursive: true });
  });
  it("should be able to create a file", () => {
    ReactFS.render(<file name="test.txt">Hello World</file>, tempDir);
    expect(readFileSync(path.join(tempDir, "test.txt")).toString()).toBe(
      "Hello World"
    );
  });
  it("should be able to create a directory", () => {
    ReactFS.render(<directory name="test" />, tempDir);
    expect(statSync(path.join(tempDir, "test")).isDirectory()).toBe(true);
  });
  it("should be able to create a file into a directory", () => {
    ReactFS.render(
      <directory name="foo">
        <file name="test.txt">Hello World</file>
      </directory>,
      tempDir
    );
    expect(readFileSync(path.join(tempDir, "foo", "test.txt")).toString()).toBe(
      "Hello World"
    );
  });
  it("should be able to create multiple fles into a directory", () => {
    ReactFS.render(
      <directory name="multiple">
        <file name="foo.txt">Foo</file>
        <file name="bar.txt">Bar</file>
      </directory>,
      tempDir
    );
    expect(
      readFileSync(path.join(tempDir, "multiple", "foo.txt")).toString()
    ).toBe("Foo");
    expect(
      readFileSync(path.join(tempDir, "multiple", "bar.txt")).toString()
    ).toBe("Bar");
  });
  it("should be able to update a content of a file", async () => {
    const App = () => {
      const [text, setText] = useState("initial");
      useEffect(() => {
        setText("updated");
      }, []);
      return <file name="foo.txt">{text}</file>;
    };

    ReactFS.render(<App />, tempDir);
    expect(readFileSync(path.join(tempDir, "foo.txt")).toString()).toBe(
      "initial"
    );
    await waitEffect();
    expect(readFileSync(path.join(tempDir, "foo.txt")).toString()).toBe(
      "updated"
    );
  });
  it("should be able to update a file name", async () => {
    const App = () => {
      const [text, setText] = useState("initial");
      useEffect(() => {
        setText("updated");
      }, []);
      return <file name={`${text}.txt`}>123</file>;
    };

    ReactFS.render(<App />, tempDir);
    expect(readFileSync(path.join(tempDir, "initial.txt")).toString()).toBe(
      "123"
    );
    await waitEffect();
    expect(readFileSync(path.join(tempDir, "updated.txt")).toString()).toBe(
      "123"
    );
    expect(existsSync(path.join(tempDir, "initial.txt"))).toBe(false);
  });
});
