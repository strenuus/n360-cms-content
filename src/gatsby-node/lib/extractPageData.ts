import fs from "fs";
import path from "path";

export default function extractPageData(page: string, parseData: Function) {
  const inputPath = `./public/page-data/${page}/page-data.json`;
  const outputDir = "./public/data/";

  const pageData = fs.readFileSync(inputPath, { encoding: "utf8" });
  const data = JSON.parse(pageData)["result"]["data"];
  const parsedData = parseData(data);
  const output = JSON.stringify(parsedData);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${page}.json`);

  console.info(`writing ${outputPath}`);
  fs.writeFileSync(outputPath, output);
}
