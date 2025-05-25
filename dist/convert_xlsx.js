"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertExcelFunc = void 0;
exports.toCamelCaseArray = toCamelCaseArray;
exports.fetechJsonFunc = fetechJsonFunc;
const node_1 = __importDefault(require("read-excel-file/node"));
const fs = __importStar(require("fs"));
function toCamelCaseArray(strings) {
    return strings.map((str) => {
        const words = str.trim().split(/[\s_\-]+/); // split on space, underscore, dash
        return words
            .map((word, index) => {
            if (index === 0)
                return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
            .join("");
    });
}
function arraysEqual(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
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
let outFiles;
const convertExcelFunc = async function (inFilePath, outFilePath) {
    // fs.readdir(outputDir, (error, files) => {
    //   outFiles = files;
    // });
    // fs.readdir(inputDir, (err, files) => {
    //   if (err) {
    //     console.error("Error reading directory:", err);
    //     return;
    //   }
    //   const xlsxFiles = files.filter((file) => file.endsWith(".xlsx"));
    // xlsxFiles.forEach((file) => {
    // const inFilePath = path.join(inputDir, file);
    // const outFileName = `${file.split("xlsx")[0]}json`;
    // const outFilePath = path.join(outputDir, outFileName);
    (0, node_1.default)(inFilePath).then(async (rows) => {
        let headers = rows.shift();
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
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            jsonData.push(obj);
            // console.log(jsonData);
        }
        const outJson = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(`output_json/${outFilePath.split("xlsx")[0]}json`, outJson, "utf-8");
    });
    // }
    // );
    // });
};
exports.convertExcelFunc = convertExcelFunc;
// async function askFileName(): Promise<string> {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   return new Promise((resolve) => {
//     rl.question("Enter file name: ", (answer) => {
//       rl.close();
//       resolve(answer.trim());
//     });
//   });
// }
// const dispalyReqFile = async function () {
//   const args = process.argv.slice(2);
//   let fileName: string = args[0];
//   if (!fileName) {
//     fileName = await askFileName();
//   }
//   //  else {
//   //   // fileName = args[0];
//   //   console.log(fileName);
//   // }
//   const outFilePath = path.join(outputDir, fileName! + ".json");
//   if (fs.existsSync(outFilePath)) {
//     const data = fs.readFileSync(outFilePath, "utf-8");
//     const jsonData = JSON.parse(data);
//     console.log(jsonData);
//   }
// };
// convertExcel().then(() => {
//   dispalyReqFile();
// });
function fetechJsonFunc(fileName) {
    const data = fs.readFileSync(`output_json/${fileName}.json`, "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
}
