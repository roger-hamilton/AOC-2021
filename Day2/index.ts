import { readLines } from '../utils';

interface Direction {
  dir: 'forward' | 'down' | 'up'
  value: number
}

const parseLine = (line: string): Direction => {
  const [dir, value] = line.split(' ')
  return {
    dir: dir as any,
    value: parseInt(value)
  }
};

const step1 = ([x, depth]: [number, number], { dir, value }: Direction): [number, number] => {
  switch (dir) {
    case 'down':
      return [x, depth + value];
    case 'up':
      return [x, Math.max(0, depth - value)];
    case 'forward':
      return [x + value, depth];
  }
}

const step2 = ([x, depth, aim]: [number, number, number], { dir, value }: Direction): [number, number, number] => {
  switch (dir) {
    case 'down':
      return [x, depth, aim + value];
    case 'up':
      return [x, depth, aim - value];
    case 'forward':
      return [x + value, depth + (aim * value), aim];
  }
}

const main = async () => {
  const lines = await readLines('./Day2/input.txt');
  const input = lines.map(parseLine);

  const p1 = input.reduce(step1, [0, 0] as [number, number]);
  const part1 = p1[0] * p1[1];
  console.log(`Part 1: ${part1}`);

  const p2 = input.reduce(step2, [0, 0, 0] as [number, number, number]);
  const part2 = p2[0] * p2[1];
  console.log(`Part 2: ${part2}`);
}

main();