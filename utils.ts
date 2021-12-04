import fs from 'fs/promises'

export const readLines = async (filePath: string) => {
  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return data.split("\n");
}

export const toInt = (value: string) => parseInt(value, 10);

export const splitBy = (lines: string[], separator: string) => {
  const groupes = [] as string[][];
  let currentGroup = [] as string[];
  for (const line of lines) {
    if (line === separator) {
      groupes.push(currentGroup);
      currentGroup = [];
    } else {
      currentGroup.push(line);
    }
  }
  groupes.push(currentGroup);
  return groupes;
}