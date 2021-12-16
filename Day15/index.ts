import { readLines, memo, range, splitBy, toInt, chain } from '../utils';

const parseInput = (lines: string[]): number[][] =>
  lines.map(line => line.split('').map(toInt));

const nextToDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const getNextTo = (x: number, y: number): [number, number][] =>
  nextToDirs.map(([dx, dy]) => [x + dx, y + dy]);

interface Cell { risk: number; minRiskTo: number; near: Cell[]; }

const calcRisks = (grid: number[][]) => {
  
  const riskGrid = grid.map(row =>
    row.map(risk => ({ risk, minRiskTo: Infinity, near: [], } as Cell)));
    
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      const cell = riskGrid[y][x];
      cell.near = getNextTo(x, y)
      .map(([x, y]) => riskGrid[y]?.[x])
      .filter(x => x !== undefined);
    }
  }
    
  const toCheck: Cell[] = [riskGrid[0][0]];
  const toCheckSet = new Set<Cell>(toCheck);

  while (toCheck.length) {
    const curr = toCheck.shift()!;
    toCheckSet.delete(curr);
    const near = curr.near;

    const minRisk = curr.near.reduce((acc, curr) => Math.min(acc, curr.minRiskTo), Infinity);

    const originalRisk = curr.minRiskTo;

    curr.minRiskTo = minRisk < Infinity ? Math.min(minRisk + curr.risk, originalRisk) : 0;

    if (originalRisk !== curr.minRiskTo) {
      const toAdd = near.filter(c => !toCheckSet.has(c))
      for(const k of toAdd) {
        toCheck.push(k);
        toCheckSet.add(k);
      }
    };
  }

  return riskGrid;
}



const last = <T>(arr: T[][]) => arr[arr.length - 1][arr[arr.length - 1].length - 1];

const part1 = (grid: number[][]) =>
  chain(grid)
    .pipe(calcRisks)
    .pipe(last)
    .valueOf()
    .minRiskTo;

const expandGrid = (grid: number[][]) => {
  const newGrid = [] as number[][];

  const setAt = (x: number, y: number, val: number) => {
    newGrid[y] ??= [];
    newGrid[y][x] = val;
  }
  
  for(let i = 0; i < 5; i++) {
    for(let j = 0; j < 5; j++) {
      for(let x = 0; x < grid.length; x++) {
        for(let y = 0; y < grid[0].length; y++) {
          const val = grid[y][x];
          setAt(
            i * grid[0].length + x,
            j * grid.length    + y,
            ((val + i + j - 1) % 9) + 1);
        }
      }
    }
  }
  return newGrid;
}

const part2 = (grid: number[][]) =>
  chain(grid)
    .pipe(expandGrid)
    .pipe(calcRisks)
    .pipe(last)
    .valueOf()
    .minRiskTo

readLines('./Day15/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });