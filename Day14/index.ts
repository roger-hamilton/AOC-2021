import { memo } from './../utils';
import { readLines, toInt, splitBy } from '../utils';

type Rule = { pattern: string; insert: string }
type Input = { seed: string; rules: Rule[] }

const parseRule = (line: string): Rule => {
  const [pattern, insert] = line.split(' -> ');
  return { pattern, insert };
}

const parseInput = (lines: string[]) => {
  const [[seed], rules] = splitBy(lines, '');
  return {
    seed,
    rules: rules.map(parseRule)
  }
}

const applyAndCount = (seed: string, rules: Rule[], itr: number = 10) => {
  const ruleLookup = Object.fromEntries(rules.map(r => [r.pattern, `${r.pattern[0]}${r.insert}${r.pattern[1]}`]));

  const merge = (a: Record<string, number>, b: Record<string, number>) =>
    [...Object.entries(a), ...Object.entries(b)].reduce((acc, [key, val]) => {
      acc[key] = (acc[key] ?? 0) + val;
      return acc;
    }, {} as Record<string, number>);

  let inner = memo((str: string, itr: number): Record<string, number> => {
    if (str.length !== 2) throw new Error('Invalid string length');
    if (itr === 0) {
      return [...str].reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
    const next = ruleLookup[str];
    const left = inner(next.slice(0, 2), itr - 1);
    const right = inner(next.slice(1, 3), itr - 1);

    const res = merge(left, right);
    res[next[1]]--;
    return res
  });

  const results = [];
  for(let i = 1; i < seed.length; i++) {
    results.push(inner(seed.slice(i - 1, i + 1), itr));
  }

  const res = results.reduce((acc, val) => merge(acc, val), {} as Record<string, number>);
  for(const c of seed) {
    res[c]--;
  }
  res[seed[0]]++
  res[seed[seed.length - 1]]++;
  return res;
}

const part1 = (input: Input, itr = 10): number => {
  const charCounts = applyAndCount(input.seed, input.rules, itr);

  const sorted = Object.entries(charCounts).sort(([, a], [, b]) => b - a);

  return sorted[0][1] - sorted[sorted.length - 1][1];
}

readLines('./Day14/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input, 10)}`);
    console.log(`Part 2: ${part1(input, 40)}`);
  });