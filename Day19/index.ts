import { readLines, memo, range, splitBy, toInt, chain, pairs } from '../utils';

type Vec3<T = number> = [T, T, T];

interface Scanner { label: string; becons: Vec3[] }

interface FixedScanner extends Scanner { dir: Vec3<0|1|2|3>; loc: Vec3 }

const parseBecon = (line: string): Vec3 => line.split(',').map(toInt) as Vec3;

const parseInput = (lines: string[]): Scanner[] =>
  splitBy(lines, '')
  .map(([label, ...lines]) => ({ label, becons: lines.map(parseBecon) }));

const cosSin = (deg: number): [number, number] => [
  Math.round(Math.cos(deg *  Math.PI / 2)),
  Math.round(Math.sin(deg *  Math.PI / 2)),
];

const rotX = (deg: number) => (v: Vec3): Vec3 => {
  const [x, y, z] = v;
  const [cos, sin] = cosSin(deg);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

const rotY = (deg: number) => (v: Vec3): Vec3 => {
  const [x, y, z] = v;
  const [cos, sin] = cosSin(deg);
  return [x * cos - z * sin, y, x * sin + z * cos];
}

const rotZ = (deg: number) => (v: Vec3): Vec3 => {
  const [x, y, z] = v;
  const [cos, sin] = cosSin(deg);
  return [x * cos - y * sin, x * sin + y * cos, z];
}

const uniqueRots: Vec3<0|1|2|3>[] = [
  [ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 0, 2 ], [ 0, 0, 3 ],
  [ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 2 ], [ 0, 1, 3 ],
  [ 0, 2, 0 ], [ 0, 2, 1 ], [ 0, 2, 2 ], [ 0, 2, 3 ],
  [ 0, 3, 0 ], [ 0, 3, 1 ], [ 0, 3, 2 ], [ 0, 3, 3 ],
  [ 1, 0, 0 ], [ 1, 0, 1 ], [ 1, 0, 2 ], [ 1, 0, 3 ],
  [ 1, 2, 0 ], [ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
];

const allRots = memo(
  (scanner: Scanner): (Scanner & { dir: Vec3<0|1|2|3> })[] =>
    uniqueRots.flatMap(([dx, dy, dz]) => ({
      ...scanner,
      dir: [dx, dy, dz],
      becons: scanner.becons.map(b => 
        chain(b).pipe(rotX(dx)).pipe(rotY(dy)).pipe(rotZ(dz)).valueOf())
    })));

const add = (a: Vec3) => (b: Vec3): Vec3 =>
  [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const subFrom = (a: Vec3) => (b: Vec3): Vec3 =>
  [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const eq = (a: Vec3) => (b: Vec3): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const count = <T>(arr: T[], pred: (t: T) => boolean): number =>
  arr.reduce((acc, t) => pred(t) ? acc + 1 : acc, 0);

const findOverlap = memo(
  (s1: FixedScanner, s2: Scanner, minOverlap = 12): FixedScanner | undefined => {
    const rots = allRots(s2);
    for (let i =0; i < s1.becons.length; i++) {
      const b1 = s1.becons[i];
      for (let j = 0; j < rots.length; j++) {
        const rot = rots[j];
        for(let k = 0 ; k < rot.becons.length; k++) {
          const b2 = rot.becons[k];
          const loc = subFrom(b1)(b2);
          const becons = rot.becons.map(add(loc));
          const overlap = count(becons, b2 => s1.becons.some(eq(b2)));
          if (overlap >= minOverlap) return { ...rot, becons, loc };
        }
      }
    }
  });

const findAllOverlaps = ([first, ...rest]: Scanner[]): FixedScanner[] => {
  let fixedScanners: FixedScanner[] = [{
    ...first,
    loc: [0,0,0],
    dir: [0,0,0]
  }];
  const unfixedScanners = [...rest];
  for(let i = 0; i < fixedScanners.length; i++) {
    const s1 = fixedScanners[i];
    for(let j = 0; j < unfixedScanners.length; j++) {
      const overlap = findOverlap(s1, unfixedScanners[j]);
      if (overlap) {
        fixedScanners.push(overlap);
        unfixedScanners.splice(j, 1);
      }
    }
  }

  return fixedScanners;
}

const part1 = (scanners: Scanner[]): number => {
  const fixedScanners = findAllOverlaps(scanners);
  const becons = new Set(fixedScanners.flatMap(s =>
    s.becons.map(b => `${b[0]},${b[1]},${b[2]}`)));
  return becons.size;
}

const manhattan = (a: Vec3, b: Vec3): number =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

const part2 = (scanners: Scanner[]): number => {
  const fixedScanners = findAllOverlaps(scanners);
  let max = 0;
  for(const s1 of fixedScanners) {
    for(const s2 of fixedScanners) {
      if (s1 === s2) continue;
      const dist = manhattan(s1.loc, s2.loc);
      if (dist > max) max = dist;
    }
  }
  return max;
}

readLines('./Day19/input.txt')
  .then(parseInput)
  .then((input) => {
    console.time('part1');
    console.log(`Part 1: ${part1(input)}`);
    console.timeEnd('part1');
    console.time('part2');
    console.log(`Part 2: ${part2(input)}`);
    console.timeEnd('part2');
  });