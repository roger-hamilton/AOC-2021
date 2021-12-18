import { arrayBuffer, json } from 'stream/consumers';
import { readLines, memo, range, splitBy, toInt, chain, pairs } from '../utils';

type SnailFish = [number | SnailFish, number | SnailFish];

const parseInput = (lines: string[]) =>
  lines.map(line => JSON.parse(line) as SnailFish);

const leftMost = (sf: SnailFish): number =>
  Array.isArray(sf[0]) ? leftMost(sf[0]) : sf[0];

const explodePath = (s: SnailFish, depth = 0): SnailFish[] => {
  if (depth === 4) return [s];
  const [l, r] = s;
  if (Array.isArray(l)) {
    const ls = explodePath(l, depth + 1);
    if (ls.length) return [s, ...ls];
  }
  if (Array.isArray(r)) {
    const rs = explodePath(r, depth + 1);
    if (rs.length) return [s, ...rs];
  }
  return [];
}

const processExplosion = (path: SnailFish[]) => {
  let target = path[path.length - 1] as [number, number];
  let pr: SnailFish | undefined;
  let pl: SnailFish | undefined;
  let c: SnailFish = target;
  for (let i = path.length - 1; i >= 0; i--) {
    if (!pr && path[i][0] === c) {
      pr = path[i];
    }
    if (!pl && path[i][1] === c) {
      pl = path[i];
    }
    c = path[i];
  }

  const proc = (snail: SnailFish, a: 0 | 1, b: 0 | 1) => {
    if (Array.isArray(snail[b])) {
      snail = snail[b] as SnailFish;
      while (Array.isArray(snail[a])) {
        snail = snail[a] as SnailFish;
      }
      (snail[a] as number) += target[b];
    } else {
      (snail[b] as number) += target[b];
    }
  }

  if (pl !== undefined) proc(pl, 1, 0);
  if (pr !== undefined) proc(pr, 0, 1);

  const pt = path[path.length - 2];

  if (pt[0] === target) {
    pt[0] = 0;
  } else {
    pt[1] = 0;
  }

  return path[0];
}

const processSplit = (input: number | SnailFish): SnailFish => {
  if (!Array.isArray(input)) {
    if (input > 9) {
      return [Math.floor(input / 2), Math.ceil(input / 2)];
    }
    return input as any as SnailFish;
  }
  const [l, r] = input as SnailFish;
  const pl = processSplit(l);
  if (pl !== l) return [pl, r];
  const pr = processSplit(r);
  if (pr !== r) return [l, pr];
  return input as SnailFish;
}

const reduce = (input: SnailFish): SnailFish => {
  const path = explodePath(input);
  if (path.length) {
    return reduce(processExplosion(path));
  }

  if(input.flat(Infinity).some(x => x > 9)) {
    return reduce(processSplit(input));
  }

  return input;
}

const add = (s1: SnailFish, s2: SnailFish): SnailFish => reduce([s1, s2]);

const magnitude = (s: number | SnailFish): number =>
  Array.isArray(s)
  ? 3 * magnitude(s[0]) + 2 * magnitude(s[1])
  : s;
const part1 = (input: SnailFish[]) => magnitude(input.reduce(add));

const deepClone = (input: number | SnailFish): number | SnailFish => 
  Array.isArray(input)
  ? [deepClone(input[0]), deepClone(input[1])]
  : input;

const part2 = (input: SnailFish[]) =>
  pairs(input)
    .map(p => p.map(deepClone) as [SnailFish, SnailFish])
    .reduce((acc, [s1, s2]) => Math.max(acc, magnitude(add(s1, s2))), 0);


readLines('./Day18/input.txt')
  .then(parseInput)
  .then((input) => {

    console.log(`Part 1: ${part1(input.map(deepClone) as SnailFish[])}`);

    console.log(`Part 2: ${part2(input)}`);
  });