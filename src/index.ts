import * as fs from "fs";
import path from "path";

const propertiesFilePath = path.join(__dirname, "..", "properties.json");

const invalidPropsError = Error(
  'You need to create properties.json file in the project root with content {"ibReportPath": "path_to_your_report"}'
);

if (!fs.existsSync(propertiesFilePath)) {
  throw invalidPropsError;
}

const properties: { ibReportPath?: string } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "properties.json"), "utf8")
);

const ibReportPath = properties.ibReportPath;

if (!ibReportPath) {
  throw invalidPropsError;
}

console.log(ibReportPath);
