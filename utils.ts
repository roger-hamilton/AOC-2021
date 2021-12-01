import fs from 'fs/promises'

export const readLines = async (filePath: string) => {
  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return data.split("\n");
}