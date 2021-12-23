/**
 * This is the most messy solution of all the days so far.
 * ...but it works.
 */

const adj = [ //      0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
  /*  0 room A1  */ [ 0, 0, 6, 5, 8, 7,10, 9, 4, 3, 3, 5, 7, 9,10],
  /*  1 room A2  */ [ 0, 0, 5, 4, 7, 6, 9, 8, 3, 2, 2, 4, 6, 8, 9],
  /*  2 room B1  */ [ 6, 5, 0, 0, 6, 5, 8, 7, 6, 5, 3, 3, 5, 7, 8],
  /*  3 room B2  */ [ 5, 4, 0, 0, 5, 4, 7, 6, 5, 4, 2, 2, 4, 6, 7],
  /*  4 room C1  */ [ 8, 7, 6, 5, 0, 0, 6, 5, 8, 7, 5, 3, 3, 5, 6],
  /*  5 room C2  */ [ 7, 6, 5, 4, 0, 0, 5, 4, 7, 6, 4, 2, 2, 4, 5],
  /*  6 room D1  */ [10, 9, 8, 7, 6, 5, 0, 0,10, 9, 7, 5, 3, 3, 4],
  /*  7 room D2  */ [ 9, 8, 7, 6, 5, 4, 0, 0, 9, 8, 6, 4, 2, 2, 3],
  /*  8 left 1   */ [ 4, 3, 6, 5, 8, 7,10, 9, 0, 0, 0, 0, 0, 0, 0],
  /*  9 left 2   */ [ 3, 2, 5, 4, 7, 6, 9, 8, 0, 0, 0, 0, 0, 0, 0],
  /* 10 center 1 */ [ 3, 2, 3, 2, 5, 4, 7, 6, 0, 0, 0, 0, 0, 0, 0],
  /* 11 center 2 */ [ 5, 4, 3, 2, 3, 2, 5, 4, 0, 0, 0, 0, 0, 0, 0],
  /* 12 center 3 */ [ 7, 6, 5, 5, 3, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0],
  /* 13 right 1  */ [ 9, 8, 7, 6, 5, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0],
  /* 14 right 2  */ [10, 9, 8, 7, 6, 7, 4, 3, 0, 0, 0, 0, 0, 0, 0],
];

enum Loc {
  RoomA1, RoomA2, RoomB1, RoomB2, RoomC1, RoomC2, RoomD1, RoomD2,
  Left1, Left2, Center1, Center2, Center3, Right1, Right2,
}

enum Loc2 {
  RoomA1, RoomA2, RoomA3, RoomA4,
  RoomB1, RoomB2, RoomB3, RoomB4,
  RoomC1, RoomC2, RoomC3, RoomC4,
  RoomD1, RoomD2, RoomD3, RoomD4,
  Left1, Left2,
  Center1, Center2, Center3,
  Right1, Right2,
}

type Piece = 'A' | 'B' | 'C' | 'D';
type Space = Piece | '.';

type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;
type State = Tuple<Space, 15>;
type State2 = Tuple<Space, 23>;

const isSolved = (state: State) => {
  const [a1, a2, b1, b2, c1, c2, d1, d2] = state;
  return  a1 === 'A' && a2 === 'A' &&
          b1 === 'B' && b2 === 'B' &&
          c1 === 'C' && c2 === 'C' &&
          d1 === 'D' && d2 === 'D';
}

type Solution = { piece: Piece, from: Loc, to: Loc }[];

const canMoveTo = (state: State, f: number, t: number): boolean => {
  if (f > t) return canMoveTo(state, t, f);
  if (adj[f][t] === 0) return false;
  const isEmpty = (i: number) => state[i] === '.';
  switch (f) {
    case Loc.RoomA1:
      if (!isEmpty(Loc.RoomA2)) return false;
    case Loc.RoomA2:
      switch (t) {
        case Loc.Left1:
          return isEmpty(Loc.Left2)
        case Loc.Left2:
        case Loc.Center1:
          return true;
        case Loc.RoomB1:
          if (!isEmpty(Loc.RoomB2)) return false;
        case Loc.RoomB2:
          return isEmpty(Loc.Center1);
        case Loc.Center2:
          return isEmpty(Loc.Center1);
        case Loc.RoomC1:
          if (!isEmpty(Loc.RoomC2)) return false;
        case Loc.RoomC2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2);
        case Loc.Center3:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2);
        case Loc.RoomD1:
          if (!isEmpty(Loc.RoomD2)) return false;
        case Loc.RoomD2:
        case Loc.Right1:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.Right2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2) && isEmpty(Loc.Center3) && isEmpty(Loc.Right1);
      }
    case Loc.RoomB1:
      if (!isEmpty(Loc.RoomB2)) return false;
    case Loc.RoomB2:
      switch (t) {
        case Loc.Left1:
          return isEmpty(Loc.Left2) && isEmpty(Loc.Center1);
        case Loc.Left2:
          return isEmpty(Loc.Center1);
        case Loc.RoomA1:
          if (!isEmpty(Loc.RoomA2)) return false;
        case Loc.RoomA2:
          return isEmpty(Loc.Center1);
        case Loc.Center1:
        case Loc.Center2:
          return true;
        case Loc.RoomC1:
          if (!isEmpty(Loc.RoomC2)) return false;
        case Loc.RoomC2:
          return isEmpty(Loc.Center2);
        case Loc.Center3:
          return isEmpty(Loc.Center2);
        case Loc.RoomD1:
          if (!isEmpty(Loc.RoomD2)) return false;
        case Loc.RoomD2:
        case Loc.Right1:
          return isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.Right2:
          return isEmpty(Loc.Center2) && isEmpty(Loc.Center3) && isEmpty(Loc.Right1);
      }
    case Loc.RoomC1:
      if (!isEmpty(Loc.RoomC2)) return false;
    case Loc.RoomC2:
      switch (t) {
        case Loc.Left1:
          return isEmpty(Loc.Left2) && isEmpty(Loc.Center1) && isEmpty(Loc.Center2);
        case Loc.Left2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2);
        case Loc.RoomA1:
          if (!isEmpty(Loc.RoomA2)) return false;
        case Loc.RoomA2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2);
        case Loc.Center1:
          return isEmpty(Loc.Center2);
        case Loc.RoomB1:
          if (!isEmpty(Loc.RoomB2)) return false;
        case Loc.RoomB2:
          return isEmpty(Loc.Center2);
        case Loc.Center2:
        case Loc.Center3:
          return true;
        case Loc.RoomD1:
          if (!isEmpty(Loc.RoomD2)) return false;
        case Loc.RoomD2:
        case Loc.Right1:
          return isEmpty(Loc.Center3);
        case Loc.Right2:
          return isEmpty(Loc.Center3) && isEmpty(Loc.Right1);
      }
    case Loc.RoomD1:
      if (!isEmpty(Loc.RoomD2)) return false;
    case Loc.RoomD2:
      switch (t) {
        case Loc.Left1:
          return isEmpty(Loc.Left2) && isEmpty(Loc.Center1) && isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.Left2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.RoomA1:
          if (!isEmpty(Loc.RoomA2)) return false;
        case Loc.RoomA2:
          return isEmpty(Loc.Center1) && isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.Center1:
          return isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.RoomB1:
          if (!isEmpty(Loc.RoomB2)) return false;
        case Loc.RoomB2:
          return isEmpty(Loc.Center2) && isEmpty(Loc.Center3);
        case Loc.Center2:
          return isEmpty(Loc.Center3);
        case Loc.RoomC1:
          if (!isEmpty(Loc.RoomC2)) return false;
        case Loc.RoomC2:
          return isEmpty(Loc.Center3);
        case Loc.Center3:
        case Loc.Right1:
          return true;
        case Loc.Right2:
          return isEmpty(Loc.Right1);
      }
  }
  return false;
}

const locName = (loc: number) => {
  switch (loc) {
    case Loc.RoomA1: return 'Room A1';
    case Loc.RoomA2: return 'Room A2';
    case Loc.RoomB1: return 'Room B1';
    case Loc.RoomB2: return 'Room B2';
    case Loc.RoomC1: return 'Room C1';
    case Loc.RoomC2: return 'Room C2';
    case Loc.RoomD1: return 'Room D1';
    case Loc.RoomD2: return 'Room D2';
    case Loc.Left1: return 'Left 1';
    case Loc.Left2: return 'Left 2';
    case Loc.Center1: return 'Center 1';
    case Loc.Center2: return 'Center 2';
    case Loc.Center3: return 'Center 3';
    case Loc.Right1: return 'Right 1';
    case Loc.Right2: return 'Right 2';
  }
}

const printState = (state: State) => {
  console.log(`#############`);
  console.log(`#${state[Loc.Left1]}${state[Loc.Left2]}.${state[Loc.Center1]}.${state[Loc.Center2]}.${state[Loc.Center3]}.${state[Loc.Right1]}${state[Loc.Right2]}#`);
  console.log(`###${state[Loc.RoomA2]}#${state[Loc.RoomB2]}#${state[Loc.RoomC2]}#${state[Loc.RoomD2]}###`);
  console.log(`  #${state[Loc.RoomA1]}#${state[Loc.RoomB1]}#${state[Loc.RoomC1]}#${state[Loc.RoomD1]}#  `);
  console.log(`  #########  `);
}
const solveCache = new Map<string, Solution>();

const energy = { A: 1, B: 10, C: 100, D: 1000 };

const energyForPath = (path: Solution): number => {
  return path.reduce((acc, { piece: peice, from, to }) => {
    const pe = energy[peice];
    const d = adj[from][to];
    const me = pe * d;
    return acc + me;
  }, 0);
}

const solve = (state: State, seen = new Set<string>()): Solution => {
  const key = state.join('');
  if (seen.has(key)) return [];
  if (solveCache.has(key)) return solveCache.get(key)!;
  if (isSolved(state)) return [{ piece: 'A', from: Loc.RoomA1, to: Loc.RoomA1 }];

  seen.add(key);

  let minEnergy = Infinity;
  let minPath: Solution = [];
  for(let f = 0; f < adj.length; f++) {
    // do not move if there is no peice to move
    if (state[f] === '.') continue;
    // or if the peice is in the correct spot
    if (f === Loc.RoomA1 && state[f] === 'A') continue;
    if (f === Loc.RoomB1 && state[f] === 'B') continue;
    if (f === Loc.RoomC1 && state[f] === 'C') continue;
    if (f === Loc.RoomD1 && state[f] === 'D') continue;
    if (f === Loc.RoomA2 && state[f] === 'A' && state[f-1] === 'A') continue;
    if (f === Loc.RoomB2 && state[f] === 'B' && state[f-1] === 'B') continue;
    if (f === Loc.RoomC2 && state[f] === 'C' && state[f-1] === 'C') continue;
    if (f === Loc.RoomD2 && state[f] === 'D' && state[f-1] === 'D') continue;

    for (let t = 0; t < adj.length; t++) {
      // do not move if there is no connection
      if (adj[f][t] === 0) continue;
      // or the spot is already occupied
      if (state[t] !== '.') continue;
      // or if the move is blocked
      if (!canMoveTo(state, f, t)) continue;
      // or if the move is to a room not for its piece
      if ((t === Loc.RoomA1 || t === Loc.RoomA2) && state[f] !== 'A') continue;
      if ((t === Loc.RoomB1 || t === Loc.RoomB2) && state[f] !== 'B') continue;
      if ((t === Loc.RoomC1 || t === Loc.RoomC2) && state[f] !== 'C') continue;
      if ((t === Loc.RoomD1 || t === Loc.RoomD2) && state[f] !== 'D') continue;
      // or if the move is to room x-2 and room x-1 is empty
      if (t === Loc.RoomA2 && state[Loc.RoomA1] === '.') continue;
      if (t === Loc.RoomB2 && state[Loc.RoomB1] === '.') continue;
      if (t === Loc.RoomC2 && state[Loc.RoomC1] === '.') continue;
      if (t === Loc.RoomD2 && state[Loc.RoomD1] === '.') continue;
      // or if the move is to room x-2 and room x-1 is not for the same piece
      // if (t === Loc.Room12 && state[Loc.Room11] !== 'A') continue;
      // if (t === Loc.Room22 && state[Loc.Room21] !== 'B') continue;
      // if (t === Loc.Room32 && state[Loc.Room31] !== 'C') continue;
      // if (t === Loc.Room42 && state[Loc.Room41] !== 'D') continue;
      
      const newState = [...state] as State;
      [newState[t], newState[f]] = [state[f], state[t]];
      const next = solve(newState, seen);

      if (next.length === 0) continue;

      const solution: Solution = [{ piece: state[f] as Piece, from: f as Loc, to: t as Loc }, ...next];
      const e = energyForPath(solution);

      if (e < minEnergy) {
        minEnergy = e;
        minPath = solution;
      }
    }
  }
  seen.delete(key);
  solveCache.set(key, minPath);
  return minPath;
}

const printMove = ({ piece, from, to}: Solution[number]) => 
  console.log(`Move: ${piece} from ${locName(from)}, to: ${locName(to)}, energy: ${energy[piece] * adj[from][to]}`);

const printPath = (path: Solution) => {
  let e = 0;
  path.forEach(m => {
    printMove(m);
    e += energy[m.piece] * adj[m.from][m.to];
  });
  console.log(`Total energy: ${e}`);
};

const replay = (solution: Solution, state: State) => {
  const newState = [...state] as State;
  let e = 0;
  for (const { piece, from, to } of solution) {
    printState(newState);
    console.log('Energy:', e);
    printMove({ piece, from, to });
    e += energy[piece] * adj[from][to];
    [newState[to], newState[from]] = [newState[from], newState[to]];
  }
  printState(newState);
  console.log('Energy:', e);
}

const parse = (s: string): State => {
  const [, l1, l2, c1, c2, c3, r1, r2, r12, r22, r32, r42, r11, r21, r31, r41] = /^#+\n#(.)(.)\.(.)\.(.)\.(.)\.(.)(.)#\n#{3}(.)#(.)#(.)#(.)#{3}\n\s+#(.)#(.)#(.)#(.)#/.exec(s) as string[];
  return [r11, r12, r21, r22, r31, r32, r41, r42, l1, l2, c1, c2, c3, r1, r2] as State
}


const expandedAdj = [ //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22
    /*  0 room A1  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 5, 5, 7, 9,11,12],
    /*  1 room A2  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 4, 6, 8,10,11],
    /*  2 room A3  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 3, 5, 7, 9,10],
    /*  3 room A4  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 2, 4, 6, 8, 9],
    /*  4 room B1  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 5, 7, 9,10],
    /*  5 room B2  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 6, 4, 4, 6, 8, 9],
    /*  6 room B3  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 5, 3, 3, 5, 7, 8],
    /*  7 room B4  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 2, 2, 4, 6, 7],
    /*  8 room C1  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 9, 7, 5, 5, 7, 8],
    /*  9 room C2  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 6, 4, 4, 6, 7],
    /* 10 room C3  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 3, 3, 5, 6],
    /* 11 room C4  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 6, 4, 2, 2, 4, 5],
    /* 12 room D1  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,11, 9, 7, 5, 5, 6],
    /* 13 room D2  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,10, 8, 6, 4, 4, 5],
    /* 14 room D3  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 9, 7, 5, 3, 3, 4],
    /* 15 room D4  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 6, 4, 2, 2, 3],
    /* 16 left 1   */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 17 left 2   */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 18 center 1 */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 19 center 2 */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 20 center 3 */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 21 right 1  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 22 right 2  */ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

for(let i = 0; i < expandedAdj.length; i++) {
  for(let j = 0; j < i; j++) {
    expandedAdj[i][j] = expandedAdj[j][i];
  }
}

const isSolved2 = (state: State2) => {
  const [a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4] = state;
  return  a1 === 'A' && a2 === 'A' && a3 === 'A' && a4 === 'A' &&
          b1 === 'B' && b2 === 'B' && b3 === 'B' && b4 === 'B' &&
          c1 === 'C' && c2 === 'C' && c3 === 'C' && c4 === 'C' &&
          d1 === 'D' && d2 === 'D' && d3 === 'D' && d4 === 'D';
}

const energyForPath2 = (path: Solution2): number => {
  return path.reduce((acc, { piece: peice, from, to }) => {
    const pe = energy[peice];
    const d = expandedAdj[from][to];
    const me = pe * d;
    return acc + me;
  }, 0);
}


const canMoveTo2 = (state: State2, f: number, t: number): boolean => {
  if (f > t) return canMoveTo2(state, t, f);
  if (expandedAdj[f][t] === 0) return false;
  const isEmpty = (i: number) => state[i] === '.';
  switch (f) {
    case Loc2.RoomA1:
      if (!isEmpty(Loc2.RoomA2)) return false;
    case Loc2.RoomA2:
      if(!isEmpty(Loc2.RoomA3)) return false;
    case Loc2.RoomA3:
      if(!isEmpty(Loc2.RoomA4)) return false;
    case Loc2.RoomA4:
      switch (t) {
        case Loc2.Left1:
          return isEmpty(Loc2.Left2)
        case Loc2.Left2:
        case Loc2.Center1:
          return true;
        case Loc2.RoomB1:
          if (!isEmpty(Loc2.RoomB2)) return false;
        case Loc2.RoomB2:
          if (!isEmpty(Loc2.RoomB3)) return false;
        case Loc2.RoomB3:
          if (!isEmpty(Loc2.RoomB4)) return false;
        case Loc2.RoomB4:
          return isEmpty(Loc2.Center1);
        case Loc2.Center2:
          return isEmpty(Loc2.Center1);
        case Loc2.RoomC1:
          if (!isEmpty(Loc2.RoomC2)) return false;
        case Loc2.RoomC2:
          if (!isEmpty(Loc2.RoomC3)) return false;
        case Loc2.RoomC3:
          if (!isEmpty(Loc2.RoomC4)) return false;
        case Loc2.RoomC4:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2);
        case Loc2.Center3:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2);
        case Loc2.RoomD1:
          if (!isEmpty(Loc2.RoomD2)) return false;
        case Loc2.RoomD2:
          if (!isEmpty(Loc2.RoomD3)) return false;
        case Loc2.RoomD3:
          if (!isEmpty(Loc2.RoomD4)) return false;
        case Loc2.RoomD4:
        case Loc2.Right1:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.Right2:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3) && isEmpty(Loc2.Right1);
      }
    case Loc2.RoomB1:
      if (!isEmpty(Loc2.RoomB2)) return false;
    case Loc2.RoomB2:
      if (!isEmpty(Loc2.RoomB3)) return false;
    case Loc2.RoomB3:
      if (!isEmpty(Loc2.RoomB4)) return false;
    case Loc2.RoomB4:
      switch (t) {
        case Loc2.Left1:
          return isEmpty(Loc2.Left2) && isEmpty(Loc2.Center1);
        case Loc2.Left2:
          return isEmpty(Loc2.Center1);
        case Loc2.RoomA1:
          if (!isEmpty(Loc2.RoomA2)) return false;
        case Loc2.RoomA2:
          if (!isEmpty(Loc2.RoomA3)) return false;
        case Loc2.RoomA3:
          if (!isEmpty(Loc2.RoomA4)) return false;
        case Loc2.RoomA4:
          return isEmpty(Loc2.Center1);
        case Loc2.Center1:
        case Loc2.Center2:
          return true;
        case Loc2.RoomC1:
          if (!isEmpty(Loc2.RoomC2)) return false;
        case Loc2.RoomC2:
          if (!isEmpty(Loc2.RoomC3)) return false;
        case Loc2.RoomC3:
          if (!isEmpty(Loc2.RoomC4)) return false;
        case Loc2.RoomC4:
        case Loc2.Center3:
          return isEmpty(Loc2.Center2);
        case Loc2.RoomD1:
          if (!isEmpty(Loc2.RoomD2)) return false;
        case Loc2.RoomD2:
          if (!isEmpty(Loc2.RoomD3)) return false;
        case Loc2.RoomD3:
          if (!isEmpty(Loc2.RoomD4)) return false;
        case Loc2.RoomD4:
        case Loc2.Right1:
          return isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.Right2:
          return isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3) && isEmpty(Loc2.Right1);
      }
    case Loc2.RoomC1:
      if (!isEmpty(Loc2.RoomC2)) return false;
    case Loc2.RoomC2:
      if (!isEmpty(Loc2.RoomC3)) return false;
    case Loc2.RoomC3:
      if (!isEmpty(Loc2.RoomC4)) return false;
    case Loc2.RoomC4:
      switch (t) {
        case Loc2.Left1:
          return isEmpty(Loc2.Left2) && isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2);
        case Loc2.Left2:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2);
        case Loc2.RoomA1:
          if (!isEmpty(Loc2.RoomA2)) return false;
        case Loc2.RoomA2:
          if (!isEmpty(Loc2.RoomA3)) return false;
        case Loc2.RoomA3:
          if (!isEmpty(Loc2.RoomA4)) return false;
        case Loc2.RoomA4:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2);
        case Loc2.Center1:
          return isEmpty(Loc2.Center2);
        case Loc2.RoomB1:
          if (!isEmpty(Loc2.RoomB2)) return false;
        case Loc2.RoomB2:
          if (!isEmpty(Loc2.RoomB3)) return false;
        case Loc2.RoomB3:
          if (!isEmpty(Loc2.RoomB4)) return false;
        case Loc2.RoomB4:
          return isEmpty(Loc2.Center2);
        case Loc2.Center2:
        case Loc2.Center3:
          return true;
        case Loc2.RoomD1:
          if (!isEmpty(Loc2.RoomD2)) return false;
        case Loc2.RoomD2:
          if (!isEmpty(Loc2.RoomD3)) return false;
        case Loc2.RoomD3:
          if (!isEmpty(Loc2.RoomD4)) return false;
        case Loc2.RoomD4:
          return isEmpty(Loc2.Center3);
        case Loc2.Right1:
          return isEmpty(Loc2.Center3);
        case Loc2.Right2:
          return isEmpty(Loc2.Center3) && isEmpty(Loc2.Right1);
      }
    case Loc2.RoomD1:
      if (!isEmpty(Loc2.RoomD2)) return false;
    case Loc2.RoomD2:
      if (!isEmpty(Loc2.RoomD3)) return false;
    case Loc2.RoomD3:
      if (!isEmpty(Loc2.RoomD4)) return false;
    case Loc2.RoomD4:
      switch (t) {
        case Loc2.Left1:
          return isEmpty(Loc2.Left2) && isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.Left2:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.RoomA1:
          if (!isEmpty(Loc2.RoomA2)) return false;
        case Loc2.RoomA2:
          if (!isEmpty(Loc2.RoomA3)) return false;
        case Loc2.RoomA3:
          if (!isEmpty(Loc2.RoomA4)) return false;
        case Loc2.RoomA4:
          return isEmpty(Loc2.Center1) && isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.Center1:
          return isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.RoomB1:
          if (!isEmpty(Loc2.RoomB2)) return false;
        case Loc2.RoomB2:
          if (!isEmpty(Loc2.RoomB3)) return false;
        case Loc2.RoomB3:
          if (!isEmpty(Loc2.RoomB4)) return false;
        case Loc2.RoomB4:
          return isEmpty(Loc2.Center2) && isEmpty(Loc2.Center3);
        case Loc2.Center2:
          return isEmpty(Loc2.Center3);
        case Loc2.RoomC1:
          if (!isEmpty(Loc2.RoomC2)) return false;
        case Loc2.RoomC2:
          if (!isEmpty(Loc2.RoomC3)) return false;
        case Loc2.RoomC3:
          if (!isEmpty(Loc2.RoomC4)) return false;
        case Loc2.RoomC4:
          return isEmpty(Loc2.Center3);
        case Loc2.Center3:
        case Loc2.Right1:
          return true;
        case Loc2.Right2:
          return isEmpty(Loc2.Right1);
      }
  }
  return false;
}

type Solution2 = { piece: Piece, from: Loc2, to: Loc2 }[];
const solve2Cache = new Map<string, Solution2>();
const seen = new Set<string>();
const solve2 = (state: State2): Solution2 => {
  if (state.length !== 23) throw new Error('invalid state length');
  const key = state.join('');
  if (seen.has(key)) return [];
  if (solve2Cache.has(key)) return solve2Cache.get(key)!;
  if (isSolved2(state)) return [{ piece: 'A', from: Loc2.RoomA1, to: Loc2.RoomA1 }];
  
  seen.add(key);

  let minEnergy = Infinity;
  let minPath: Solution2 = [];
  for(let f = 0; f < expandedAdj.length; f++) {
    // do not move if there is no peice to move
    if (state[f] === '.') continue;
    // or if the peice is in the correct spot
    if (f === Loc2.RoomA1 && state[f] === 'A') continue;
    if (f === Loc2.RoomB1 && state[f] === 'B') continue;
    if (f === Loc2.RoomC1 && state[f] === 'C') continue;
    if (f === Loc2.RoomD1 && state[f] === 'D') continue;
    if (f === Loc2.RoomA2 && state[f] === 'A' && state[Loc2.RoomA1] === 'A') continue;
    if (f === Loc2.RoomB2 && state[f] === 'B' && state[Loc2.RoomB1] === 'B') continue;
    if (f === Loc2.RoomC2 && state[f] === 'C' && state[Loc2.RoomC1] === 'C') continue;
    if (f === Loc2.RoomD2 && state[f] === 'D' && state[Loc2.RoomD1] === 'D') continue;
    if (f === Loc2.RoomA3 && state[f] === 'A' && state[Loc2.RoomA2] === 'A' && state[Loc2.RoomA1] === 'A') continue;
    if (f === Loc2.RoomB3 && state[f] === 'B' && state[Loc2.RoomB2] === 'B' && state[Loc2.RoomB1] === 'B') continue;
    if (f === Loc2.RoomC3 && state[f] === 'C' && state[Loc2.RoomC2] === 'C' && state[Loc2.RoomC1] === 'C') continue;
    if (f === Loc2.RoomD3 && state[f] === 'D' && state[Loc2.RoomD2] === 'D' && state[Loc2.RoomD1] === 'D') continue;
    if (f === Loc2.RoomA4 && state[f] === 'A' && state[Loc2.RoomA3] === 'A' && state[Loc2.RoomA2] === 'A' && state[Loc2.RoomA1] === 'A') continue;
    if (f === Loc2.RoomB4 && state[f] === 'B' && state[Loc2.RoomB3] === 'B' && state[Loc2.RoomB2] === 'B' && state[Loc2.RoomB1] === 'B') continue;
    if (f === Loc2.RoomC4 && state[f] === 'C' && state[Loc2.RoomC3] === 'C' && state[Loc2.RoomC2] === 'C' && state[Loc2.RoomC1] === 'C') continue;
    if (f === Loc2.RoomD4 && state[f] === 'D' && state[Loc2.RoomD3] === 'D' && state[Loc2.RoomD2] === 'D' && state[Loc2.RoomD1] === 'D') continue;


    for (let t = 0; t < expandedAdj.length; t++) {
      // do not move if there is no connection
      if (expandedAdj[f][t] === 0) continue;
      // or the spot is already occupied
      if (state[t] !== '.') continue;
      // or if the move is blocked
      if (!canMoveTo2(state, f, t)) continue;
      // or if the move is to a room not for its piece
      if ((t === Loc2.RoomA1 || t === Loc2.RoomA2 || t === Loc2.RoomA3 || t === Loc2.RoomA4) && state[f] !== 'A') continue;
      if ((t === Loc2.RoomB1 || t === Loc2.RoomB2 || t === Loc2.RoomB3 || t === Loc2.RoomB4) && state[f] !== 'B') continue;
      if ((t === Loc2.RoomC1 || t === Loc2.RoomC2 || t === Loc2.RoomC3 || t === Loc2.RoomC4) && state[f] !== 'C') continue;
      if ((t === Loc2.RoomD1 || t === Loc2.RoomD2 || t === Loc2.RoomD3 || t === Loc2.RoomD4) && state[f] !== 'D') continue;
      // or if the move is to room x-(n) and room x-(n-1) is empty
      if (t === Loc2.RoomA2 && state[Loc2.RoomA1] === '.') continue;
      if (t === Loc2.RoomA3 && state[Loc2.RoomA2] === '.') continue;
      if (t === Loc2.RoomA4 && state[Loc2.RoomA3] === '.') continue;
      if (t === Loc2.RoomB2 && state[Loc2.RoomB1] === '.') continue;
      if (t === Loc2.RoomB3 && state[Loc2.RoomB2] === '.') continue;
      if (t === Loc2.RoomB4 && state[Loc2.RoomB3] === '.') continue;
      if (t === Loc2.RoomC2 && state[Loc2.RoomC1] === '.') continue;
      if (t === Loc2.RoomC3 && state[Loc2.RoomC2] === '.') continue;
      if (t === Loc2.RoomC4 && state[Loc2.RoomC3] === '.') continue;
      if (t === Loc2.RoomD2 && state[Loc2.RoomD1] === '.') continue;
      if (t === Loc2.RoomD3 && state[Loc2.RoomD2] === '.') continue;
      if (t === Loc2.RoomD4 && state[Loc2.RoomD3] === '.') continue;

      // or if the move is to room x-2 and room x-1 is not for the same piece
      if (t === Loc2.RoomA2 && state[Loc2.RoomA1] !== 'A') continue;
      if (t === Loc2.RoomB2 && state[Loc2.RoomB1] !== 'B') continue;
      if (t === Loc2.RoomC2 && state[Loc2.RoomC1] !== 'C') continue;
      if (t === Loc2.RoomD2 && state[Loc2.RoomD1] !== 'D') continue;
      if (t === Loc2.RoomA3 && (state[Loc2.RoomA2] !== 'A' || state[Loc2.RoomA1] !== 'A')) continue;
      if (t === Loc2.RoomB3 && (state[Loc2.RoomB2] !== 'B' || state[Loc2.RoomB1] !== 'B')) continue;
      if (t === Loc2.RoomC3 && (state[Loc2.RoomC2] !== 'C' || state[Loc2.RoomC1] !== 'C')) continue;
      if (t === Loc2.RoomD3 && (state[Loc2.RoomD2] !== 'D' || state[Loc2.RoomD1] !== 'D')) continue;
      if (t === Loc2.RoomA4 && (state[Loc2.RoomA3] !== 'A' || state[Loc2.RoomA2] !== 'A' || state[Loc2.RoomA1] !== 'A')) continue;
      if (t === Loc2.RoomB4 && (state[Loc2.RoomB3] !== 'B' || state[Loc2.RoomB2] !== 'B' || state[Loc2.RoomB1] !== 'B')) continue;
      if (t === Loc2.RoomC4 && (state[Loc2.RoomC3] !== 'C' || state[Loc2.RoomC2] !== 'C' || state[Loc2.RoomC1] !== 'C')) continue;
      if (t === Loc2.RoomD4 && (state[Loc2.RoomD3] !== 'D' || state[Loc2.RoomD2] !== 'D' || state[Loc2.RoomD1] !== 'D')) continue;

      const newState = [...state] as State2;
      [newState[t], newState[f]] = [state[f], state[t]];
      const next = solve2(newState);

      if (next.length === 0) continue;

      const solution: Solution2 = [{ piece: state[f] as Piece, from: f as Loc2, to: t as Loc2 }, ...next];
      const e = energyForPath2(solution);

      if (e < minEnergy) {
        minEnergy = e;
        minPath = solution;
      }
    }
  }

  seen.delete(key);
  solve2Cache.set(key, minPath);
  return minPath;
}

const locName2 = (l: Loc2) => {
  switch (l) {
    case Loc2.RoomA1: return 'A1';
    case Loc2.RoomA2: return 'A2';
    case Loc2.RoomA3: return 'A3';
    case Loc2.RoomA4: return 'A4';
    case Loc2.RoomB1: return 'B1';
    case Loc2.RoomB2: return 'B2';
    case Loc2.RoomB3: return 'B3';
    case Loc2.RoomB4: return 'B4';
    case Loc2.RoomC1: return 'C1';
    case Loc2.RoomC2: return 'C2';
    case Loc2.RoomC3: return 'C3';
    case Loc2.RoomC4: return 'C4';
    case Loc2.RoomD1: return 'D1';
    case Loc2.RoomD2: return 'D2';
    case Loc2.RoomD3: return 'D3';
    case Loc2.RoomD4: return 'D4';
    case Loc2.Right1: return 'Right 1';
    case Loc2.Right2: return 'Right 2';
    case Loc2.Center1: return 'Center 1';
    case Loc2.Center2: return 'Center 2';
    case Loc2.Center3: return 'Center 3';
    case Loc2.Left1: return 'Left 1';
    case Loc2.Left2: return 'Left 2';
  }
}


const printMove2 = ({ piece, from, to}: Solution2[number]) => 
  console.log(`Move: ${piece} from ${locName2(from)}, to: ${locName2(to)}, energy: ${energy[piece] * expandedAdj[from][to]}`);

const printPath2 = (path: Solution2) => {
  let e = 0;
  path.forEach(m => {
    printMove2(m);
    e += energy[m.piece] * expandedAdj[m.from][m.to];
  });
  console.log(`Total energy: ${e}`);
}

const printState2 = (state: State2) => {
  console.log(`#############`);
  console.log(`#${state[Loc2.Left1]}${state[Loc2.Left2]}.${state[Loc2.Center1]}.${state[Loc2.Center2]}.${state[Loc2.Center3]}.${state[Loc2.Right1]}${state[Loc2.Right2]}#`);
  console.log(`###${state[Loc2.RoomA4]}#${state[Loc2.RoomB4]}#${state[Loc2.RoomC4]}#${state[Loc2.RoomD4]}###`);
  console.log(`  #${state[Loc2.RoomA3]}#${state[Loc2.RoomB3]}#${state[Loc2.RoomC3]}#${state[Loc2.RoomD3]}#  `);
  console.log(`  #${state[Loc2.RoomA2]}#${state[Loc2.RoomB2]}#${state[Loc2.RoomC2]}#${state[Loc2.RoomD2]}#  `);
  console.log(`  #${state[Loc2.RoomA1]}#${state[Loc2.RoomB1]}#${state[Loc2.RoomC1]}#${state[Loc2.RoomD1]}#  `);
  console.log(`  #########  `);
}

const replay2 = (solution: Solution2, state: State2) => {
  const newState = [...state] as State2;
  let e = 0;
  for (const { piece, from, to } of solution) {
    printState2(newState);
    console.log('Energy:', e);
    printMove2({ piece, from, to });
    e += energy[piece] * expandedAdj[from][to];
    [newState[to], newState[from]] = [newState[from], newState[to]];
  }
  printState2(newState);
  console.log('Energy:', e);
}

const test = parse(`
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`.trim())
const input: State = parse(`
#############
#...........#
###D#B#B#A###
  #C#C#D#A#
  #########`.trim());

const e1 = solve(input).slice(0, -1);
// replay(e2, input);
console.log(`Part 1: ${energyForPath(e1)}`);

const expandInput = ([a1, a2, b1, b2, c1, c2, d1, d2, ...rest]: State): State2 => [
  a1, 'D', 'D', a2,
  b1, 'B', 'C', b2,
  c1, 'A', 'B', c2,
  d1, 'C', 'A', d2,
  ...rest
];
const input2 = expandInput(input);
const e2 = solve2(input2).slice(0, -1);
console.log(`Part 2: ${energyForPath2(e2)}`);