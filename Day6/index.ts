import { toInt, readLines, memo } from '../utils';

const calcPop = memo((input: number, days: number): number =>
  days <= input ? 1: calcPop(6, days - input - 1) + calcPop(8, days - input - 1))
  
const sumPop = (input: number[], days: number = 80): number =>
  input.reduce((acc, curr) => acc + calcPop(curr, days), 0);

readLines('./Day6/input.txt')
  .then(([line]) => line.split(',').map(toInt))
  .then(input => {
    console.log(`Part 1: ${sumPop(input)}`);
    console.log(`Part 2: ${sumPop(input, 256)}`);
  });