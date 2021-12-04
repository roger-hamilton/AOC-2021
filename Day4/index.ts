import { splitBy, toInt, readLines } from '../utils';

const parseBalls = (line: string) =>
  line.split(',').map(toInt);

const parseBoard = (board: string[]) =>
  board.map(row => row.split(/\s+/).filter(Boolean).map(toInt));

const asCols = (board: number[][]) => board[0].map((_, i) => board.map(row => row[i]));

const isWinner = (board: number[][], balls: number[]) =>
  board.some(row => row.every(b => balls.includes(b)))
  || asCols(board).some(row => row.every(b => balls.includes(b)));

const allRuns = (balls: number[]) =>
  [...Array(balls.length).keys()].map(i => balls.slice(0, i + 1))

const part1 = (boards: number[][][], balls: number[]) => {
  const [currentBalls, winner] = allRuns(balls)
      .map(balls => [balls, boards.find(board => isWinner(board, balls))])
      .find(([, winner]) => winner) as [number[], number[][]];

  const sumOfUnmarked  = winner.flat()
    .filter(b => !currentBalls.includes(b)).reduce((a, b) => a + b)

  return currentBalls[currentBalls.length - 1] * sumOfUnmarked;
}

const part2 = (boards: number[][][], balls: number[]) => {
  let loosers = boards;
  for(const run of allRuns(balls)) {
    loosers = loosers.filter(board => !isWinner(board, run));
    if (loosers.length === 1) break;
  }
  
  return part1(loosers, balls);
}

const main = async () => {
  const lines = await readLines('./Day4/input.txt');
  const [[ballsRaw], ...boardsRaw] = splitBy(lines, '');
  
  const balls = parseBalls(ballsRaw);
  const boards = boardsRaw.map(parseBoard);

  const p1 = part1(boards, balls);
  console.log(`Part 1: ${p1}`);

  const p2 = part2(boards, balls);
  console.log(`Part 2: ${p2}`);
};

main();