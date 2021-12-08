import { toInt, readLines, chain, range } from '../utils';

type Point = { x: number; y: number };
const point = (x: number, y: number): Point => ({ x, y });

type Line = { from: Point, to: Point };
const line = (from: Point, to: Point): Line => ({ from, to });

const parseLine = (l: string) => {
  const [from, to] = l.split(' -> ')
    .map(p => point(...p.split(',').map(toInt) as [number, number]));
  return line(from, to);
}

const isStraight = ({ from, to }: Line) => from.x === to.x || from.y === to.y;

const getPoints = (from: Point, to: Point): Set<string> => {
  const xs = range(from.x, to.x);
  const ys = range(from.y, to.y);
  return from.x === to.x
    ? ys.map(y => `${from.x},${y}`)
      .reduce((acc, p) => acc.add(p), new Set<string>())
    : xs.map((x, i) => `${x},${ys.length > 1 ? ys[i] : ys[0]}`)
      .reduce((acc, p) => acc.add(p), new Set<string>());
}

const setIntersection = <T>(s1: Set<T>, s2: Set<T>): Set<T> => 
  [...s1].reduce((int, el) => s2.has(el) ? int.add(el) : int, new Set<T>());
  
const manySetUnion = <T>(sets: Set<T>[]): Set<T> =>
  sets.reduce((acc, s) => [...s].reduce((a, c) => a.add(c), acc), new Set<T>());

const pairs = <T>(arr: T[]): [T, T][] =>
  arr.reduce((acc, v, i) => {
    const rest = arr.slice(i + 1);
    return acc.concat(rest.map(v2 => [v, v2]));
  }, [] as [T, T][]);

const findIntersections = (input: Line[]) =>
  chain(input.map(l => getPoints(l.from, l.to)))
    .pipe(pairs)
    .pipe(p => p.map(([s1, s2]) => setIntersection(s1, s2)))
    .pipe(manySetUnion)
    .valueOf();

const part1 = (input: Line[]) => findIntersections(input.filter(isStraight)).size;

const part2 = (input: Line[]) => findIntersections(input).size;

const main = async () => {
  const lines = await readLines('./Day5/input.txt');
  const input = lines.map(parseLine);
  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part2(input)}`);
};

main();