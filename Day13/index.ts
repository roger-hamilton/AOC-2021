import { readLines, toInt, splitBy } from '../utils';

type Dot = [number, number]
interface Fold { axis: 'x' | 'y'; value: number }
interface Puzzle {
  dots: Dot[];
  folds: Fold[];
}

const parseInput = (lines: string[]): Puzzle => {
  const [dotsRaw, foldsRaw] = splitBy(lines, '');
  const dots = dotsRaw.map(line => line.split(',').map(toInt) as Dot);
  const folds = foldsRaw.map(line => {
    const [, axis, valRaw] = /^fold along (x|y)=(\d+)$/.exec(line)!;
    return { axis, value: toInt(valRaw) } as Fold;
  });

  return { dots, folds };
}

const foldX = (dots: Dot[], value: number): Dot[] =>
  dots.map(([dx, dy]) => dx > value ? [2 * value - dx, dy] : [dx, dy]);

const foldY = (dots: Dot[], value: number): Dot[] =>
  dots.map(([dx, dy]) => dy > value ? [dx, 2 * value - dy] : [dx, dy]);

const fold = (dots: Dot[], fold: Fold): Dot[] =>
  fold.axis === 'x' ? foldX(dots, fold.value) : foldY(dots, fold.value);

const uniqueDots = (dots: Dot[]): Dot[] =>
  dots.filter(([dx, dy], i) => dots.findIndex(([x, y]) => x === dx && y === dy) === i);

const part1 = (puzzle: Puzzle): number =>
  uniqueDots(fold(puzzle.dots, puzzle.folds[0])).length;

const toString = (dots: Dot[]): string =>
  dots.reduce((acc, [x, y]) => {
    acc[y] ??= [...Array(1000)].fill(' ');
    acc[y][x] = '#';
    return acc;
  }, [] as string[][])
  .map(line => line.join('').trim()).join('\n');

const part2 = (puzzle: Puzzle): string => toString(puzzle.folds.reduce((d, f) => fold(d, f), puzzle.dots));

readLines('./Day13/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2:\n${part2(input)}`);
  });