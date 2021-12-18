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

export const invert = <K extends string | number | symbol, V extends string | number | symbol>(obj: Record<K, V>): Record<V, K> =>
  (Object.entries(obj) as [K, V][]).reduce((a, [k, v]) => ({ ...a, [v]: k }), {} as Record<V, K>);


export const diff = <T>(a: Set<T>, b: Set<T>) => new Set([...a].filter(x => !b.has(x)));
export const union = <T>(...sets: Set<T>[]) => sets.reduce((a, c) => [...c].reduce((a2, c2) => a.add(c2), a), new Set<T>());
export const single = <T>(set: Set<T>) => [...set][0];

export const pairs = <T>(arr: T[]) => arr.flatMap((x, i) => [...arr.slice(0, i), ...arr.slice(i + 1)].map(y => [x, y] as const));