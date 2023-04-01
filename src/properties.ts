import * as fs from "fs";
import path from "path";

export function readProperties() {
  const invalidPropsError = Error(
    "You need to create properties.json file in the project root and fill it as described in README"
  );

  const propertiesFilePath = path.join(__dirname, "..", "properties.json");

  if (!fs.existsSync(propertiesFilePath)) {
    throw invalidPropsError;
  }

  const properties: {
    ibReportPath?: string;
    eurUsdPath?: string;
    resultDirPath?: string;
  } = JSON.parse(fs.readFileSync(propertiesFilePath, "utf8"));

  const { ibReportPath, eurUsdPath, resultDirPath } = properties;

  if (!ibReportPath || !eurUsdPath || !resultDirPath) {
    throw invalidPropsError;
  }

  return { ibReportPath, eurUsdPath, resultDirPath };
}
