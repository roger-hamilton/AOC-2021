import { readLines } from '../utils';

const parseLine = (line: string) => parseInt(line, 2);

let step1 = (nums: number[]) => (bit: number) => {
  const mask = 1 << bit;
  const results = nums.filter(num => num & mask);
  return results.length >= nums.length / 2 ? mask : 0;
}

const part1 = (nums: number[], len: number) => {
  const commonBit = step1(nums);
  const gamma = [...Array(len).keys()].reduce((acc, c) => acc + commonBit(c), 0);
  const epsilon = ~gamma & ((1 << len) - 1);
  return gamma * epsilon;
}

const part2 = (nums: number[], len: number) => {
  let bit = len - 1;
  let ox = [...nums];
  while (ox.length > 1) {
    const mask = 1 << bit;
    const common = step1(ox)(bit);
    ox = ox.filter(num => (num & mask) === common);
    bit--;
  }

  bit = len - 1;
  let co2 = [...nums];
  while (co2.length > 1) {
    const mask = 1 << bit;
    const common = step1(co2)(bit);
    co2 = co2.filter(num => (num & mask) !== common);
    bit--;
  }

  return ox[0] * co2[0];
}

(async () => {
  const lines = await readLines('./Day3/input.txt');
  const len = lines[0].length;
  const input = lines.map(parseLine);
  
  const p1 = part1(input, len);
  console.log(`Part 1: ${p1}`);

  const p2 = part2(input, len);
  console.log(`Part 2: ${p2}`);
})();