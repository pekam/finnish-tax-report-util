import * as fs from "fs";
import path from "path";
import { readFile } from "./file-util";

export interface Properties {
  ibReportPath: string;
  binanceReportPath: string;
  eurUsdPath: string;
  resultDirPath: string;
}

let propertiesCache: Properties | undefined = undefined;

export function getProperties(): Properties {
  propertiesCache = propertiesCache || readProperties();
  return propertiesCache;
}

function readProperties() {
  const propertiesFilePath = path.join(__dirname, "..", "properties.json");

  if (!fs.existsSync(propertiesFilePath)) {
    throw Error(
      "You need to create properties.json file in the project root and fill it as described in README"
    );
  }

  const properties: Properties = JSON.parse(readFile(propertiesFilePath));

  if (
    !properties.ibReportPath ||
    !properties.eurUsdPath ||
    !properties.resultDirPath
  ) {
    throw Error(
      "The properties.json file is invalid. Make sure that it has the contents described in README."
    );
  }

  return properties;
}
