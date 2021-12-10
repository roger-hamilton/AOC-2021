import { readLines, toInt } from '../utils';

const parseInput = (lines: string[]) => lines.map(line => line.split('').map(toInt));

const neighborPos = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const neighbors = <T>(x: number, y: number, grid: T[][]) =>
  neighborPos.map(pos => grid[x + pos[0]]?.[y + pos[1]]).filter(x => x !== undefined);

const isMin = (x: number, y: number, grid: number[][]) =>
  neighbors(x, y, grid).every(n => n > grid[x][y]);

interface MinItem {
  val: number
  pos: [number, number]
}

const allMins = (grid: number[][]) =>
  grid.reduce((acc, row, x) =>
    row.reduce((acc, _, y) =>
      isMin(x, y, grid) ? [...acc, { val: grid[x][y], pos: [x, y] } as MinItem] : acc, acc),
      [] as MinItem[]);

const drainsTo = (x: number, y: number, grid: number[][]): [number, number] | null => {
  if (grid[x][y] === 9) return null;
  if (isMin(x, y, grid)) return [x, y];

  const [nx, ny] = neighborPos
    .map(pos => [x + pos[0], y + pos[1]])
    .filter(pos => grid[pos[0]]?.[pos[1]] !== undefined)
    .find(pos => grid[pos[0]][pos[1]] < grid[x][y])!;

  return drainsTo(nx, ny, grid);
}

const getBasins = (grid: number[][]) =>
  grid.reduce((acc, row, x) =>
    [...acc, row.reduce((acc, _, y) => [...acc, drainsTo(x, y, grid)], [] as ([number, number] | null)[])],
    [] as ([number, number] | null)[][]);

const part1 = (grid: number[][]) =>
  allMins(grid).reduce((acc, min) => acc + (min.val + 1), 0);

const notNull = <T>(x: T | null): x is T => x !== null;

const part2 = (grid: number[][]) => {
  const sizes = getBasins(grid)
    .flat()
    .filter(notNull)
    .map(([x, y]) => `${x},${y}`)
    .reduce((acc, pos) => ({ ...acc, [pos]: acc[pos] ? acc[pos] + 1 : 1 }), {} as Record<string, number>);
  const orderedSizes = Object.values(sizes).sort((a, b) => b - a);
  const top3 = orderedSizes.slice(0, 3);
  return top3.reduce((acc, size) => acc * size, 1);
}
    

readLines('./Day9/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });