import { readLines, memo, range, splitBy } from '../utils';

type Rule = { pattern: string; insert: string }
type Input = { seed: string; rules: Rule[] }

const parseRule = (line: string): Rule => {
  const [pattern, insert] = line.split(' -> ');
  return { pattern, insert };
}

const parseInput = (lines: string[]) => {
  const [[seed], rules] = splitBy(lines, '');
  return { seed, rules: rules.map(parseRule) };
}

const addTo = (record: Record<string, number>, [key, value]: [string, number]) => {
  record[key] = (record[key] ?? 0) + value;
  return record;
}

const merge = (a: Record<string, number>, b: Record<string, number>) =>
  [...Object.entries(b)].reduce(addTo, {...a});

const inc = (record: Record<string, number>, key: string) => addTo(record, [key, 1]);
const dec = (record: Record<string, number>, key: string) => addTo(record, [key, -1]);

const applyAndCount = (seed: string, rules: Rule[], itr: number = 10) => {
  const ruleLookup = Object.fromEntries(rules.map(r => [
    r.pattern,
    `${r.pattern[0]}${r.insert}${r.pattern[1]}`
  ]));

  let inner = memo((str: string, itr: number): Record<string, number> => {
    if (itr === 0) return [...str].reduce(inc, {});
    const next = ruleLookup[str];
    const res = merge(
      inner(next.slice(0, 2), itr - 1),
      inner(next.slice(1, 3), itr - 1));

    // remove the overlapping center char
    res[next[1]]--;
    return res;
  });

  const results = range(1, seed.length - 1)
    .map(i => inner(seed.slice(i - 1, i + 1), itr))
    .reduce(merge, {});

  return range(1, seed.length - 2)
    .map(i => seed[i])
    .reduce(dec, results);
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