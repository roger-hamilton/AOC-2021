import { readLines, memo, range, splitBy, toInt, chain, pairs } from '../utils';

type Algorithm = (0|1)[];
type Grid = (0|1)[][];
type Input = { algo: Algorithm; grid: Grid }

const parseInput = ([algo,,...grid]: string[]): Input => ({
  algo: algo.split('').map(x => x ==='#'? 1 : 0),
  grid: grid.map(line => line.split('').map(x => x === '#'? 1 : 0)),
});

const indexer = [
  [-1,-1], [0,-1], [1,-1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]];

const isOn = (input: Input) => {
  const inner = memo((x: number, y: number, itr: number): 0 | 1 => {
    if (itr === 0) return input.grid[y]?.[x] ?? 0;
    const toCheck = indexer.map(i => [x + i[0], y + i[1]]);
    const idx = toCheck
      .map(([dy, dx]) => inner(dy, dx, itr - 1))
      .reduce((acc, curr) => (acc << 1) + curr, 0 as number);
    return input.algo[idx];
  });
  return inner;
}

const gridItr = (input: Input, itr: number) => {
  const [xRange, yRange] = [
    range(-itr, input.grid[0].length + itr - 1),
    range(-itr, input.grid.length + itr - 1),
  ];
  const check = isOn(input);

  return yRange.map(y => xRange.map(x => check(x, y, itr)));
}

const part1 = (input: Input) =>
  gridItr(input, 2)
    .reduce((acc, curr) => acc + curr.reduce((acc, curr) => acc + curr, 0 as number), 0);

const part2 = (input: Input) =>
  gridItr(input, 50)
    .reduce((acc, curr) => acc + curr.reduce((acc, curr) => acc + curr, 0 as number), 0);

readLines('./Day20/input.txt')
  .then(parseInput)
  .then((input) => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });