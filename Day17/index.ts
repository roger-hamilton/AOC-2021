import { range, toInt } from "../utils";

type Vec2<T = number> = [T, T];
type Target = Vec2<Vec2>;

const sumTo = (n: number) => (n + 1) * n / 2;

const part1 = (target: Target) => sumTo(-target[1][0] - 1);

type State = { pos: Vec2; vel: Vec2 };

const step = ({ pos: [x, y], vel: [dx, dy] }: State): State => {
  x += dx;
  y += dy;
  dy -= 1;
  dx = dx > 0 ? dx - 1 : dx;
  return { pos: [x, y], vel: [dx, dy] };
}

function* locs(dx: number, dy: number, maxSteps = 100) : IterableIterator<Vec2> {
  let state: State = { pos: [0, 0], vel: [dx, dy] };
  let n = 0;
  while(true) {
    state = step(state);
    yield state.pos;
    n++;
    if (n > maxSteps) break;
  }
}

// restrict the iterator to those that are above the bottom of the target
const locsAbove = (dx: number,dy: number, target: number): Vec2[] => {
  const above = [];
  for(const loc of locs(dx, dy)) {
    if (loc[1] < target) return above
    above.push(loc);
  }
  return above;
}

const landsIn = (target: Target) => (dx: number, dy: number) => {
  const [minY, maxY] = target[1];
  const [minX, maxX] = target[0];

  const inYZone = locsAbove(dx, dy, minY)
    .filter(([, y]) => y <= maxY)
    .filter(([x]) => x >= minX && x <= maxX);

  return inYZone.length > 0;
}

const part2 = (target: Target) => {
  const [[minX, maxX], [minY, maxY]] = target;

  const dyRange = range(-minY * 2, minY * 2);
  const dxRange = range(0, maxX * 2);
  const check = landsIn(target);
  
  const arr = [];
  for(const dy of dyRange) {
    for(const dx of dxRange) {
      if (check(dx, dy)) arr.push([dx, dy]);
    }
  }
  return arr.length;
}

const test = [[20,30], [-10, -5]] as Target;
const input = [[34,67], [-215, -186]] as Target;

console.log(`Part 1: ${part1(input)}`);
// 1808 -> too low
console.log(`Part 2: ${part2(input)}`);