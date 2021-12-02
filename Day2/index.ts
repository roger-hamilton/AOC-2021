import { readLines } from '../utils';

interface Direction {
  dir: 'forward' | 'down' | 'up'
  value: number
}

const parseLine = (line: string): Direction => {
  const [dir, value] = line.split(' ');
  return { dir: dir as Direction['dir'], value: parseInt(value) };
};

interface State1 { pos: number, depth: number }

const step1 = ({ pos, depth }: State1, { dir, value }: Direction): State1 => {
  switch (dir) {
    case 'down':
      return { pos, depth: depth + value };
    case 'up':
      return { pos, depth: Math.max(0, depth - value) };
    case 'forward':
      return { pos: pos + value, depth };
  }
}

interface State2 extends State1 { aim: number }

const step2 = ({ pos, depth, aim }: State2, { dir, value }: Direction): State2 => {
  switch (dir) {
    case 'down':
      return { pos, depth, aim: aim + value };
    case 'up':
      return { pos, depth, aim: aim - value };
    case 'forward':
      return { pos: pos + value, depth: depth + (aim * value), aim };
  }
}

const main = async () => {
  const lines = await readLines('./Day2/input.txt');
  const input = lines.map(parseLine);

  const p1 = input.reduce(step1, {pos: 0, depth: 0 });
  const part1 = p1.pos * p1.depth;
  console.log(`Part 1: ${part1}`);

  const p2 = input.reduce(step2, { pos: 0, depth: 0, aim: 0 });
  const part2 = p2.pos * p2.depth;
  console.log(`Part 2: ${part2}`);
}

main();