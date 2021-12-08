import { toInt, readLines, range, sum, minmax, sumToN } from '../utils';

const sumDist = (arr: number[], p: number) => sum(arr.map(c => Math.abs(c - p)));
const sumDistSuc = (arr: number[], p: number) => sum(arr.map(c => sumToN(Math.abs(c - p))));

const minFuel = (input: number[], calcFuel: (arr: number[], center: number) => number) =>
  range(...minmax(input))
    .map(c => calcFuel(input, c))
    .reduce((acc, curr) => curr < acc ? curr : acc, Infinity);

readLines('./Day7/input.txt')
  .then(([line]) => line.split(',').map(toInt))
  .then(input => {
    console.log(`Part 1: ${minFuel(input, sumDist)}`);
    console.log(`Part 2: ${minFuel(input, sumDistSuc)}`);
  });