import { readLines } from '../utils';

const parseLine = (line: string) => parseInt(line, 2);

let step1 = (nums: number[], bit: number) => {
  const mask = 1 << bit;
  const results = nums.filter(num => num & mask);
  return results.length >= nums.length / 2 ? mask : 0;
}

const part1 = (nums: number[], len: number) => {
  const gamma = [...Array(len).keys()]
    .reduce((acc, c) => acc + step1(nums, c), 0);

  const epsilon = ~gamma & ((1 << len) - 1);
  return gamma * epsilon;
}
  
const step2 = (comp: (a: number, b: number) => boolean) => (nums: number[], bit: number) => {
  if (nums.length === 1) return nums;
  const mask = 1 << bit;
  const common = step1(nums, bit);
  return nums.filter(num => comp((num & mask), common));
}

const part2 = (nums: number[], len: number) => {
  const [ox] = [...Array(len).keys()]
    .reverse()
    .reduce(step2((a, b) => a === b), nums);

  const [co2] = [...Array(len).keys()]
    .reverse()
    .reduce(step2((a, b) => a !== b), nums);

  return ox * co2;
}

const main = async () => {
  const lines = await readLines('./Day3/test.txt');
  const len = lines[0].length;
  const input = lines.map(parseLine);
  
  const p1 = part1(input, len);
  console.log(`Part 1: ${p1}`);

  const p2 = part2(input, len);
  console.log(`Part 2: ${p2}`);
};

main();