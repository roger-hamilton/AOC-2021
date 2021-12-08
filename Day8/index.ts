import { readLines, sum, invert, diff, union, single } from '../utils';

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
type Display = Set<Segment>
type DisplayLine = [Display[], Display[]]

const parseLine = (line: string) =>
  line.split(' | ')
    .map(p => p.split(' ').map(d => new Set(d.split('')) as Display)) as DisplayLine;

const parseInput = (lines: string[]) => lines.map(parseLine) as DisplayLine[];

/*
 aaaa 
b    c
b    c
 dddd 
e    f
e    f
 gggg 
*/
const segmentDisplays = [
  'abcefg',   // 0
  'cf',       // 1
  'acdeg',    // 2
  'acdfg',    // 3
  'bcdf',     // 4
  'abdfg',    // 5
  'abdefg',   // 6
  'acf',      // 7
  'abcdefg',  // 8
  'abcdfg',   // 9
];

type Translation = Record<Segment, Segment>

const findTranslation = (key: Display[]): Translation => {
  const one = key.find(k => k.size === 2)!;
  const four = key.find(k => k.size === 4)!;
  const seven = key.find(k => k.size === 3)!;
  const eight = key.find(k => k.size === 7)!;
  const nine = key.find(k => k.size === 6 && diff(k, union(four, seven)).size === 1)!;
  
  const a = diff(seven, one)
  const e = diff(eight, nine);
  const g = diff(eight, union(seven, four, e));
  const bd = diff(four, one);

  const six = key.find(k => k.size === 6 && k !== nine && diff(bd, k).size === 0)!;
  const zero = key.find(k => k.size === 6 && k !== nine && k !== six)!;

  const c = diff(eight, six);
  const f = diff(one, c);
  const d = diff(eight, zero);
  const b = diff(bd, d);

  return invert({
    a: single(a),
    b: single(b),
    c: single(c),
    d: single(d),
    e: single(e),
    f: single(f),
    g: single(g),
  });
}

const translate = (translation: Translation, disp: Display) =>
  segmentDisplays.indexOf([...disp].map(d => translation[d]).sort().join(''));

const part1 = (input: DisplayLine[]) =>
  input.reduce((a, [,b]) => a + b.filter(d => [2,3,4,7].includes(d.size)).length, 0);

const part2 = (input: DisplayLine[]) => {
  const test = input.map(([key, display]) => {
    const translation = findTranslation(key);
    return display
      .map(d => translate(translation, d))
      .reduce((a, c) => a * 10 + c, 0);
  });
  return sum(test);
}

readLines('./Day8/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });