import { toInt, readLines, memo } from '../utils';

const calcPop = memo((input: number, days: number): number =>
  days <= input ? 1: calcPop(6, days - input - 1) + calcPop(8, days - input - 1))
  
const part1 = (input: number[], days: number = 80): number =>
  input.reduce((acc, curr) => acc + calcPop(curr, days), 0);

const main = async () => {
  const [line] = await readLines('./Day6/input.txt');
  const input = line.split(',').map(toInt);
  
  console.log(`Part 1: ${part1(input)}`);
  console.log(`Part 2: ${part1(input, 256)}`);
};

main();