import fs from 'fs/promises'

export const readLines = async (filePath: string) => {
  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return data.split("\n");
}

export const toInt = (value: string) => parseInt(value, 10);

export const splitBy = (lines: string[], separator: string) => {
  const groupes = [] as string[][];
  let currentGroup = [] as string[];
  for (const line of lines) {
    if (line === separator) {
      groupes.push(currentGroup);
      currentGroup = [];
    } else {
      currentGroup.push(line);
    }
  }
  groupes.push(currentGroup);
  return groupes;
}

export const range = (a: number, b: number): number[] =>
  a > b
  ? range(b, a).reverse()
  : [...Array(b - a + 1).keys()].map(i => i + a);

class Chain<T> {
  constructor(private readonly value: T) { }

  public pipe<U>(f: (value: T) => U): Chain<U> {
    return new Chain(f(this.value));
  }

  public valueOf(): T {
    return this.value;
  }
}

export const chain = <T>(value: T): Chain<T> => new Chain(value);

export const memo = <A extends any[], T>(f: (...args: A) => T): (...args: A) => T => {
  const cache = new Map<string, T>();
  return (...args: A) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const value = f(...args);
      cache.set(key, value);
    }
    return cache.get(key)!;
  };
}

export const sum = (arr: number[]) => arr.reduce((a, c) => a + c, 0);

export const sumToN = (n: number) => (n * (n + 1)) / 2;

export const minmax = (arr: number[]) => [Math.min(...arr), Math.max(...arr)] as const;
