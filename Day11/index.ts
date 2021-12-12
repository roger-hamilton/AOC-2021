import { readLines, toInt } from '../utils';

type Octopus = {
  x: number;
  y: number;
  energy: number;
};

const parseInput = (lines: string[]): Octopus[][] =>
  lines.map((line, y) => line.split('').map((c, x) => ({ x, y, energy: toInt(c) })));


const near = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

const neighbors = (octopus: Octopus, octopi: Octopus[][]): Octopus[] =>
  near.map(n => octopi[octopus.y + n[1]] && octopi[octopus.y + n[1]][octopus.x + n[0]])
    .filter(o => o !== undefined) as Octopus[];


const step = (octopi: Octopus[][]) => {
  let hasFlashed = true;
  for (const o of octopi.flat()) {
    o.energy += 1;
  }

  while (hasFlashed) {
    hasFlashed = false;
    for(const y in octopi) {
      for(const x in octopi[y]) {
        if (octopi[y][x].energy > 9) {
          hasFlashed = true;
          const octopus = octopi[y][x];
          octopus.energy = -Infinity;
          const nextTo = neighbors(octopus, octopi);
          for(const neighbor of nextTo) {
            neighbor.energy += 1;
          }
        }
      }
    }
  }
  const flashed = octopi.flat().filter(o => o.energy === -Infinity);
  for(const octopus of flashed) {
    octopus.energy = 0;
  }
  return flashed.length;
}

const print = (octopi: Octopus[][]) =>
  console.log(octopi.map(row => row.map(o => o.energy).join('')).join('\n'));

const part1 = (octopi: Octopus[][]) => {
  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    flashes += step(octopi);
  }
  return flashes;
}

const part2 = (octopi: Octopus[][]) => {
  const maxFlash = octopi.flat().length;
  let i = 0;
  while(true) {
    i++;
    if (step(octopi) === maxFlash) return i;
  }
}

const cloneOctopi = (octopi: Octopus[][]) => octopi.map(row => row.map(o => ({ ...o })));

readLines('./Day11/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(cloneOctopi(input))}`);
    console.log(`Part 2: ${part2(cloneOctopi(input))}`);
  });