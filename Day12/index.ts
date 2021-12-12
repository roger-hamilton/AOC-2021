import { readLines, toInt } from '../utils';

type Edge = [string, string]

const parseInput = (lines: string[]): Edge[] =>
  lines.map(line => line.split('-') as Edge);

const adjacent = (edges: Edge[]) : Record<string, string[]> => {
  const adj: Record<string, string[]> = {};
  edges.forEach(([a, b]) => {
    adj[a] ??= [];
    adj[b] ??= [];
    adj[a].push(b);
    adj[b].push(a);
  });
  return adj;
}

function* pathPred(edges: Edge[], start: string, end: string, pred: (node: string, visited: string[]) => boolean, visited: string[] = []): IterableIterator<string[]> {
  const adj = adjacent(edges);
  visited.push(start);
  for(const next of adj[start]) {
    if (next === end) {
      yield [...visited, next];
    } else if (pred(next, visited)) {
      yield* pathPred(edges, next, end, pred, visited);
    }
  }
  visited.pop();
}

function* paths1(edges: Edge[], start: string, end: string): IterableIterator<string[]> {
  const pred = (node: string, visited: string[]) => node.toUpperCase() === node || !visited.includes(node);
  yield* pathPred(edges, start, end, pred);
}

function* paths2(edges: Edge[], start: string, end: string): IterableIterator<string[]> {
  const pred = (node: string, visited: string[]) => {
    const hasDoubleVisited = visited.some((v, i, arr) => v.toLowerCase() === v && arr.indexOf(v) < i);
    return (!hasDoubleVisited || node.toUpperCase() === node || !visited.includes(node)) && (node !== start && node !== end);
  }
  yield* pathPred(edges, start, end, pred);
}

const part1 = (input: Edge[]) => [...paths1(input, 'start', 'end')].length;

const part2 = (input: Edge[]) => [...paths2(input, 'start', 'end')].length;


readLines('./Day12/input.txt')
  .then(parseInput)
  .then(input => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });