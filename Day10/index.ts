import { readLines, toInt } from '../utils';

const pairs = {
  '{': '}',
  '[': ']',
  '(': ')',
  '<': '>',
} as Record<Bracket, Bracket>;

type Bracket = '{' | '[' | '(' | '<' | '}' | ']' | ')' | '>';

const corruptPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
} as Record<Bracket, number>;

const incompletePoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
} as Record<Bracket, number>;

const parseInput = (lines: string[]) => 
  lines.map(line => line.split('') as Bracket[]);

const getCorruption = (brackets: Bracket[]) => {
  const stack = [] as Bracket[];
  for (const bracket of brackets) {
    if (bracket in pairs) {
      stack.push(bracket);
    } else if (pairs[stack.pop()!] !== bracket) {
      return bracket;
    }
  }
  return stack.map(b => pairs[b]).reverse();
}

const notArray = <T>(value: T | T[]): value is T => !Array.isArray(value);
const isArray = <T>(value: T | T[]): value is T[] => Array.isArray(value);

const part1 = (brackets: Bracket[][]) =>
  brackets
    .map(getCorruption)
    .filter(notArray)
    .reduce((acc, curr) => acc + corruptPoints[curr], 0);

const part2 = (brackets: Bracket[][]) => {
  const scores = brackets
    .map(getCorruption)
    .filter(isArray)
    .map(b2 => b2.reduce((acc, curr) => 5 * acc + incompletePoints[curr], 0))
    .sort((a, b) => a - b);
    return scores[(scores.length - 1) / 2];
}

readLines('./Day10/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });