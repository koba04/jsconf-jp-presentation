export const debug = (...args: any[]) => {
  if (process.env.NODE_ENV === "DEBUG") {
    console.log(...args);
  }
};
