import React, { useState, useEffect } from "react";
import { ReactJSON } from "../index";

const waitEffect = () => new Promise(r => setTimeout(r, 0));

describe("ReactJSON", () => {
  it("should be able to render host components and text", () => {
    const rootContainer = ReactJSON.createRootContainer();
    expect(() => {
      ReactJSON.render(
        <div id="foo">
          <p className="paragraph">
            <span>foo</span>
          </p>
        </div>,
        rootContainer
      );
      ReactJSON.render(
        <div id="foo" className="bar">
          <p className="paragraph">
            <span className="em">bar</span>
          </p>
        </div>,
        rootContainer
      );
    }).not.toThrow();
    expect(ReactJSON.toJSON(rootContainer.container)).toMatchSnapshot();
  });

  it("should be able to handle swapping list items", () => {
    const rootContainer = ReactJSON.createRootContainer();
    expect(() => {
      ReactJSON.render(
        <ul>
          <li key="a">a</li>
          <li key="b">b</li>
          <li key="c">c</li>
        </ul>,
        rootContainer
      );
      ReactJSON.render(
        <ul>
          <li key="b">b</li>
          <li key="a">a</li>
          <li key="c">c</li>
        </ul>,
        rootContainer
      );
    }).not.toThrow();
    const json: any = ReactJSON.toJSON(rootContainer.container);
    expect(json.children.map((child: any) => child.children[0])).toEqual([
      "b",
      "a",
      "c"
    ]);
    expect(json).toMatchSnapshot();
  });

  it("should be able to render composite components", () => {
    const Button = (props: { text: string }) => <button>{props.text}</button>;
    const MemoizedButton = React.memo(Button);
    const App = (props: { message: string }) => (
      <section>
        <Button text="click" />
        <p>{props.message}</p>
        <MemoizedButton text="memo" />
      </section>
    );
    const rootContainer = ReactJSON.createRootContainer();
    expect(() => {
      ReactJSON.render(<App message="Hello" />, rootContainer);
      ReactJSON.render(<App message="World" />, rootContainer);
    }).not.toThrow();
    expect(ReactJSON.toJSON(rootContainer.container)).toMatchSnapshot();
  });

  it("should be able to get logs from a container", () => {
    const rootContainer = ReactJSON.createRootContainer();
    ReactJSON.render(<div id="foo">foo</div>, rootContainer);
    ReactJSON.render(<div id="foo">foo</div>, rootContainer);
    expect(rootContainer.container.logs.map(([operation]: any[]) => operation)).toEqual([
      "commitMount",
      "commitUpdate"
    ]);
  });

  it("should be able to use Hooks", async () => {
    const rootContainer = ReactJSON.createRootContainer();
    const Counter = () => {
      const [count, setCount] = useState(0);
      useEffect(() => {
        setCount(1);
      }, []);
      return <div>{count}</div>;
    };
    ReactJSON.render(<Counter />, rootContainer);
    let json: any = ReactJSON.toJSON(rootContainer.container);
    expect(json.children[0]).toBe("0");
    // TODO: implement .act();
    await waitEffect();
    json = ReactJSON.toJSON(rootContainer.container);
    expect(json.children[0]).toBe("1");
  });
});
