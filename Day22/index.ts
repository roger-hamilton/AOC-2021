import { readLines, memo, range, splitBy, toInt, chain, pairs } from '../utils';

type Range = [number, number];
type Cube = {
  type: 'on' | 'off'
  x: Range;
  y: Range;
  z: Range;
}

const parseLine = (line: string) => {
  const [type, xyz] = line.split(' ');
  const [x, y, z] = xyz.split(',').map(p => p.slice(2).split('..').map(toInt) as Range);
  return { type, x, y, z, } as Cube;
}

const clampRange = (min: number, max: number) => (range: Range) => 
  [Math.min(Math.max(range[0], min), max), Math.max(Math.min(range[1], max), min)] as [number, number];

const clampTo50s = clampRange(-50, 50);

const clampCube = (cube: Cube): Cube => ({
  ...cube,
  x: clampTo50s(cube.x),
  y: clampTo50s(cube.y),
  z: clampTo50s(cube.z),
});

const inRange = (cube: Cube, x: number, y: number, z: number) =>
  cube.x[0] <= x && x <= cube.x[1] &&
  cube.y[0] <= y && y <= cube.y[1] &&
  cube.z[0] <= z && z <= cube.z[1];

const pointsOfCube = ({ x, y, z}: Cube) =>
  range(...x)
    .flatMap(x => range(...y)
      .flatMap(y => range(...z)
        .map(z => [x, y, z])));

const parseInput = (input: string[]) => input.map(parseLine);

const part1 = (input: Cube[]) => {
  const on = new Set<string>();
  for(const cube of input) {
    for(const [x, y, z] of pointsOfCube(clampCube(cube))) {
      if (!inRange(cube, x, y, z)) continue;
      if(cube.type === 'on') {
        on.add(`${x},${y},${z}`);
      } else {
        on.delete(`${x},${y},${z}`);
      }
    }
  }
  return on.size
}

type Box = [[number, number], [number, number], [number, number]];

const cubeToBox = ({ x, y, z }: Cube) => getBox([[x[0], x[1]], [y[0], y[1]], [z[0], z[1]]]);

const boxKey = (box: Box) => `${box[0][0]}-${box[0][1]}-${box[1][0]}-${box[1][1]}-${box[2][0]}-${box[2][1]}`;

const boxCache: Record<string, Box> = {}
const getBox = (box: Box) => {
  const key = boxKey(box);
  if (!boxCache[key]) boxCache[key] = box;
  return boxCache[key];
}

const overlapSegment = ([aMin, aMax]: Range, [bMin, bMax]: Range) => {
  if (aMin > bMax || bMin > aMax) return false;
  return [aMin, aMax, bMin, bMax].sort((a, b) => a - b).slice(1, 3);
}

const divX = (box: Box, x: number) => {
  const [x0, x1] = box[0];
  if (x1 < x || x0 > x) return new Set([getBox(box)]);
  const boxes = new Set<Box>();
  if (x0 < x) {
    boxes.add(getBox([[x0, x - 1], box[1], box[2]]));
  }
  boxes.add(getBox([[x, x1], box[1], box[2]]));
  return boxes;
}

const divY = (box: Box, y: number) => {
  const [y0, y1] = box[1];
  if (y1 < y || y0 > y) return new Set([getBox(box)]);
  const boxes = new Set<Box>();
  if (y0 < y) {
    boxes.add(getBox([box[0], [y0, y - 1], box[2]]));
  }
  boxes.add(getBox([box[0], [y, y1], box[2]]));
  return boxes;
}

const divZ = (box: Box, z: number) => {
  const [z0, z1] = box[2];
  if (z1 < z || z0 > z) return new Set([getBox(box)]);
  const boxes = new Set<Box>();
  if (z0 < z) {
    boxes.add(getBox([box[0], box[1], [z0, z - 1]]));
  }
  boxes.add(getBox([box[0], box[1], [z, z1]]));
  return boxes;
}

const divOne = (box: Box, x: number, y: number, z: number) => {
  const divided = new Set<Box>();
  for (const cx of divX(box, x)) {
    for (const cy of divY(cx, y)) {
      for (const cz of divZ(cy, z)) {
        divided.add(getBox(cz));
      }
    }
  }
  return divided;
}

const divTwo = (box: Box, p1: [number, number, number], p2: [number, number, number]) => {
  const divided = new Set<Box>();
  for (const cx of divOne(box, ...p1)) {
    for (const cy of divOne(cx, ...p2)) {
      divided.add(getBox(cy));
    }
  }
  return divided;
}

const boxInter = (a: Box, b: Box) => {
  const x = overlapSegment(a[0], b[0]);
  const y = overlapSegment(a[1], b[1]);
  const z = overlapSegment(a[2], b[2]);
  if (x && y && z) {
    const p1 = [x[0], y[0], z[0]] as [number, number, number];
    const p2 = [x[1] + 1, y[1] + 1, z[1] + 1] as [number, number, number];

    const ca = divTwo(a, p1, p2);
    const cb = divTwo(b, p1, p2);

    return [ca, cb] as [Set<Box>, Set<Box>];
  }
  return [new Set([getBox(a)]), new Set([getBox(b)])] as [Set<Box>, Set<Box>];
}

const removeBox = (ca: Box, cb: Box) => {
  const [c1, c2] = boxInter(ca, cb);
  if (c1.size === 1 && c2.size === 1 && new Set([...c1, ...c2]).size === 1) {
    return null;
  }
  return new Set([...c1].filter(c => !c2.has(c)));
}

const removeFromBoxes = (boxes: Set<Box>, box: Box) => {
  const toAdd = new Set<Box>();
  const toRemove = new Set<Box>();

  for (const c of boxes) {
    const c1 = removeBox(c, box);
    if (c1 === null) continue;

    toRemove.add(c);
    for(const c2 of c1) toAdd.add(c2);
  }

  for (const c of toRemove) boxes.delete(c);
  for(const c of toAdd) boxes.add(c);
  
  return boxes;
}

const boxSize = (box: Box) => {
  const [x0, x1] = box[0];
  const [y0, y1] = box[1];
  const [z0, z1] = box[2];
  return (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1);
}

const part2 = (input: Cube[]) => {
  let total = 0;
  for(let i = 0; i < input.length; i++) {
    const add = input[i];
    if (add.type === 'off') continue;
    let univ = new Set([cubeToBox(add)]);
    for(const sub of input.slice(i + 1).map(cubeToBox)) {
      univ = removeFromBoxes(univ, sub);
    }
    total += [...univ].reduce((a, b) => a + boxSize(b), 0);
  }
  return total;
}

readLines('./Day22/input.txt')
  .then(parseInput)
  .then((input) => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });