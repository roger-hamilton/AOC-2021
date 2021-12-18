import { range } from "../utils";

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

function* locs(dx: number, dy: number) : IterableIterator<Vec2> {
  let state: State = { pos: [0, 0], vel: [dx, dy] };
  let n = 0;
  while(true) {
    state = step(state);
    yield state.pos;
    n++;
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

  for (const [x, y] of locsAbove(dx, dy, minY)) {
    if (y >= minY && y <= maxY && x >= minX && x <= maxX) return true;
  }
  return false;
}

const part2 = (target: Target) => {
  const [[minX, maxX], [minY, maxY]] = target;

  const dyRange = range(-minY, minY);
  const dxRange = range(0, maxX);
  const check = landsIn(target);

  let count = 0;
  for(const dy of dyRange) {
    for(const dx of dxRange) {
      if (check(dx, dy)) count++;
    }
  }
  return count;
}

const test = [[20,30], [-10, -5]] as Target;
const input = [[34,67], [-215, -186]] as Target;

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);