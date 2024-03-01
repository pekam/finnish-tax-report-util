import * as fs from "fs";
import * as path from "path";
import { getProperties } from "./properties";

export const writeToResultDir = (fileName: string, content: string) => {
  const { resultDirPath } = getProperties();
  if (!resultDirPath?.length) {
    throw Error("Missing resultDirPath in properties");
  }
  const filePath = path.join(resultDirPath, fileName);
  console.log(`Writing file ${filePath}`);
  fs.writeFileSync(filePath, content);
};
