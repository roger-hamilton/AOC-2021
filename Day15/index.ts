import { readLines, memo, range, splitBy, toInt } from '../utils';

const parseInput = (lines: string[]): number[][] =>
  lines.map(line => line.split('').map(toInt));

const nextToDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const getNextTo = (x: number, y: number): [number, number][] => nextToDirs.map(([dx, dy]) => [x + dx, y + dy]);

const calcRisks = (grid: number[][]) => {
  const toCheck: [number, number][] = [];
  const toCheckSet = new Set<string>();
  
  const riskGrid = grid.map(row => row.map(risk => ({ risk, minRiskTo: Infinity })));

  const update = (x: number, y: number) => {
    const curr = riskGrid[y][x];
    if (curr === undefined) return;

    const near = getNextTo(x, y).filter(([x, y]) => riskGrid[y]?.[x] !== undefined);

    if (near.length === 0) return;
    
    const minRisk = near
      .map(([x, y]) => riskGrid[y]?.[x]?.minRiskTo)
      .reduce((acc, curr) => Math.min(acc, curr), Infinity);

    const oRisk = curr.minRiskTo;

    curr.minRiskTo = minRisk < Infinity
      ? Math.min(minRisk + curr.risk, oRisk)
      : 0;

    if (oRisk !== curr.minRiskTo) {
      const toAdd = near.filter(([x, y]) => !toCheckSet.has(`${x},${y}`))
      toCheck.push(...toAdd);
      for(const k of toAdd.map(([x, y]) => `${x},${y}`)) {
        toCheckSet.add(k);
      }
    };
  }

  update(0, 0);
  
  while (toCheck.length) {
    const [x, y] = toCheck.shift()!;
    toCheckSet.delete(`${x},${y}`);
    update(x, y);
  }

  return riskGrid.map(row => row.map(({ minRiskTo }) => minRiskTo));
}

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

const part1 = (grid: number[][]) => {
  const riskGrid = calcRisks(grid);
  return riskGrid[riskGrid.length - 1][riskGrid[0].length - 1];
}

const part2 = (grid: number[][]) => {
  console.time('expanded search');
  const riskGrid = calcRisks(expandGrid(grid));
  console.timeEnd('expanded search');
  return riskGrid[riskGrid.length - 1][riskGrid[0].length - 1];
}

readLines('./Day15/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);

    console.log(`Part 2: ${part2(input)}`);
  });