namespace JSX {
  interface IntrinsicElements {
    file: {
      name: string;
      children: React.ReactNode;
    };
    directory: {
      name: string;
      children?: React.ReactNode;
    };
  }
}
