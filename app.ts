import readXlsxFile from "read-excel-file/node";
import fs from "fs";
import path from "path";

function toCamelCaseArray(strings: string[]): string[] {
  return strings.map((str) => {
    const words = str.trim().split(/[\s_\-]+/); // split on space, underscore, dash
    return words
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  });
}
function arraysEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
// function checkExsistance(
//   outFiles: string[],
//   outFile: string,
//   outFilePath: string,
//   result: any[]
// ) {
//   let jsonData = [];
//   if (outFiles.includes(outFile)) {
//     const data = fs.readFileSync(outFilePath, "utf-8");
//     jsonData = JSON.parse(data);
//     const valuesArray = jsonData.map((obj: any) => Object.values(obj));
//     // console.log(valuesArray);
//     result = result.filter(
//       (item) => !valuesArray.some((a2: []) => arraysEqual(item, a2))
//     );
//     console.log(result);
//   }
//   return { result, jsonData };
// }

const inputDir = "./input";
const outputDir = "./output";
let outFiles: string[];
fs.readdir(outputDir, (error, files) => {
  outFiles = files;
});
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const xlsxFiles = files.filter((file) => file.endsWith(".xlsx"));

  xlsxFiles.forEach((file) => {
    const inFilePath = path.join(inputDir, file);
    const outFileName = `${file.split("xlsx")[0]}json`;

    const outFilePath = path.join(outputDir, outFileName);

    readXlsxFile(inFilePath).then(async (rows) => {
      let headers = rows.shift() as string[];
      headers = toCamelCaseArray(headers);
        let jsonData = [];
      //   console.log(headers); // 1
      //   console.log(rows); // [2, 3, 4]
      // const { result, jsonData } = checkExsistance(
      //   outFiles,
      //   outFileName,
      //   outFilePath,
      //   rows
      // );
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // console.log(row); // [2, 3, 4]

        const obj: any = {};

        headers.forEach((header, index) => {
          obj[header] = row[index];
        });

        jsonData.push(obj);
        // console.log(jsonData);
      }
      const outJson: string = JSON.stringify(jsonData, null, 2);
      //   console.log(`Parsed ${file}:`, outJson);
      //   console.log(outFile);

      fs.writeFileSync(`${outFilePath}`, outJson, "utf-8");
    });
  });
});
