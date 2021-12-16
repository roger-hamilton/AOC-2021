import { NumericLiteral } from 'typescript';
import { readLines, memo, range, splitBy, toInt, chain } from '../utils';

interface ValuePacket {
  version: number;
  type: 4;
  value: bigint;
}

interface OperatorPacket {
  version: number;
  type: number;
  lengthType: 0 | 1;
  length: number;
  packets: Packet[];
}

type Packet = ValuePacket | OperatorPacket;

const isValuePacket = (p: Packet): p is ValuePacket => p.type === 4;
const isOperatorPacket = (p: Packet): p is OperatorPacket => !isValuePacket(p);

const parseValuePacketValue = (str: string): [bigint, string] => {
  let i = 0;
  let bits = 0n;
  let flag = '1';
  while(flag === '1') {
    flag = str[i];
    const nibble = str.slice(i + 1, i + 5);
    bits = (bits << 4n) + BigInt(`0b${nibble}`);
    i+=5;
  }
  return [bits, str.slice(i)];
}

const parseOperatorPacketsByLength = (str: string, len: number): [Packet[], string] => {
  const packets = [];
  const oLen = str.length;

  while (oLen - str.length < len) {
    const [p, rest] = readPacket(str);
    packets.push(p);
    str = rest;
  }

  return [packets, str];
}

const parseOperatorPacketsByCount = (str: string, count: number): [Packet[], string] => {
  const packets = [];

  for (let i = 0; i < count; i++) {
    const [p, rest] = readPacket(str);
    packets.push(p);
    str = rest;
  }

  return [packets, str];
}

const readPacket = (bin: string): [Packet, string] => {
  if (!bin.length) throw new Error('Empty input');

  const vString = bin.slice(0, 3);
  const version = parseInt(vString, 2);

  const tString = bin.slice(3, 6);
  const type = parseInt(tString, 2);

  if (type === 4) {
    const [value, rest] = parseValuePacketValue(bin.slice(6));
    return [{ version, type, value }, rest];
  }

  const iString = bin.slice(6, 7);
  const lengthType = parseInt(iString, 2) as 0 | 1;

  const lenLen = lengthType === 0 ? 15 : 11;
  const lenString = bin.slice(7, 7 + lenLen);
  const length = parseInt(lenString, 2);

  const [packets, rest] =
    lengthType === 0
    ? parseOperatorPacketsByLength(bin.slice(7 + lenLen), length)
    : parseOperatorPacketsByCount(bin.slice(7 + lenLen), length);
  
  return [{ version, type, lengthType, length, packets, }, rest];
}

const parseInput = ([line]: string[]): string =>
  BigInt(`0x${line}`).toString(2).padStart(line.length * 4, '0');

const padZeros = (str: string, mult: number = 4): string =>
  str.length % mult === 0 ? str : padZeros(`0${str}`, mult);

const part1 = (bin: string) => {
  const [packet] = readPacket(bin);

  const flatPackets = (packets: Packet[]): Packet[] =>
    packets.flatMap(p => isValuePacket(p) ? [p] : [p, ...flatPackets(p.packets)]);

  return flatPackets([packet])
    .reduce((acc, p) => acc + p.version, 0);
}

const operators = {
  0: (vals: bigint[]): bigint => vals.reduce((acc, v) => acc + v, 0n),
  1: (vals: bigint[]): bigint => vals.reduce((acc, v) => acc * v, 1n),
  2: (vals: bigint[]): bigint => vals.reduce((acc, v) => acc < v ? acc : v),
  3: (vals: bigint[]): bigint => vals.reduce((acc, v) => acc > v ? acc : v),
  5: ([a, b]: bigint[]): bigint => a > b ? 1n : 0n,
  6: ([a, b]: bigint[]): bigint => a < b ? 1n : 0n,
  7: ([a, b]: bigint[]): bigint => a === b ? 1n : 0n,
}

const evalPacket = (packet: Packet): bigint => {
  if (isValuePacket(packet)) return packet.value;

  const packets = packet.packets.map(evalPacket);

  return operators[packet.type as keyof (typeof operators)](packets);
}

const toString= (packet: Packet): string => {
  if (isValuePacket(packet)) return packet.value.toString();

  const packets = packet.packets.map(toString).join(' ');

  const opName =
    packet.type === 0 ? 'sum' :
    packet.type === 1 ? 'prod' :
    packet.type === 2 ? 'min' :
    packet.type === 3 ? 'max' :
    packet.type === 5 ? 'lt' :
    packet.type === 6 ? 'gt' :
    packet.type === 7 ? 'eq' :
    '??';

    return `(${opName} ${packets})`;
}

const part2 = (bin: string) => {
  const [packet] = readPacket(bin);

  console.log(toString(packet));

  return evalPacket(packet);
}

readLines('./Day16/input.txt')
  .then(parseInput)
  .then((input) => {
    console.log(`Part 1: ${part1(input)}`);
    console.log(`Part 2: ${part2(input)}`);
  });