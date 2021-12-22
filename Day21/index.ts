import { memo } from '../utils';

const play = (
  [currPos, oppPos]: [number, number],
  [currScore, oppScore]: [number, number] = [0 ,0],
  roll: number = 0
): [number, number, number] => {
  if (oppScore >= 1000) {
    return (roll / 3) % 2
      ? [oppScore, currScore, roll]
      : [currScore, oppScore, roll];
  }
  const rollTotal = (3 * roll + 6) % 100;
  const newPos = (currPos + rollTotal) % 10;
  return play([oppPos, newPos], [oppScore, currScore + newPos + 1], roll + 3);
}

const rollOccurances = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]] as const;

const playQuantum = memo((
  [currPos, oppPos]: [number, number],
  [currScore, oppScore]: [number, number] = [0, 0],
  player1 = true
): [number, number] => {
  if (oppScore >= 21) return player1 ? [0, 1] : [1, 0];
  return rollOccurances
    .map(([roll, occurances]) => {
      const pos = (currPos + roll) % 10;
      const [w1, w2] = playQuantum([oppPos, pos], [oppScore, currScore + pos + 1], !player1);
      return [w1 * occurances, w2 * occurances] as [number, number];
    })
    .reduce(([a, b], [c, d]) => [a + c, b + d]);
});

const part1 = ([p1,p2]: [number, number]): number => {
  const [s1, s2, rolls] = play([p1 - 1, p2 - 1]);
  return rolls * Math.min(s1, s2);
}

const part2 = ([p1,p2]: [number, number]): number => {
  const [a, b]= playQuantum([p1 - 1, p2 - 1]);
  return a > b ? a : b;
}

const test: [number, number] = [4, 8];
const input: [number, number] = [4, 2];

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);