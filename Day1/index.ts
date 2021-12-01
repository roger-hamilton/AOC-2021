import { readLines } from '../utils';

const toInt = (str: string): number => parseInt(str, 10);

const add = (a: number, b: number) => a + b;

const sumN = (n: number) => (arr: number[]) => (idx: number) =>
  arr.slice(idx, idx + n).reduce(add, 0);

const main = async () => {
  const lines = await readLines('./Day1/input.txt');
  const input = lines.map(toInt);

  const part1 = input
    .filter((x, i, arr) => i > 0 && x > arr[i - 1])
    .length

  console.log(`Part 1: ${part1}`);

  const sum3 = sumN(3)(input);

  const part2 = input
    .map((_, i) => sum3(i))
    .filter(Boolean) // filter out the NaN values from the end
    .filter((x, i, arr) => i > 0 && x > arr[i - 1])
    .length

  console.log(`Part 2: ${part2}`);
}

main();