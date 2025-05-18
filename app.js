"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("read-excel-file/node"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function checkExsistance(outFiles, outFile, outFilePath, result) {
    let jsonData = [];
    if (outFiles.includes(outFile)) {
        const data = fs_1.default.readFileSync(outFilePath, "utf-8");
        jsonData = JSON.parse(data);
        const valuesArray = jsonData.map((obj) => Object.values(obj));
        // console.log(valuesArray);
        result = result.filter((item) => !valuesArray.some((a2) => arraysEqual(item, a2)));
        console.log(result);
    }
    return { result, jsonData };
}
const inputDir = "./input";
const outputDir = "./output";
let outFiles;
fs_1.default.readdir(outputDir, (error, files) => {
    outFiles = files;
});
fs_1.default.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }
    const xlsxFiles = files.filter((file) => file.endsWith(".xlsx"));
    xlsxFiles.forEach((file) => {
        const inFilePath = path_1.default.join(inputDir, file);
        const outFileName = `${file.split("xlsx")[0]}json`;
        const outFilePath = path_1.default.join(outputDir, outFileName);
        (0, node_1.default)(inFilePath).then(async (rows) => {
            let headers = rows.shift();
            headers = toCamelCaseArray(headers);
            //   let jsonData = [];
            //   console.log(headers); // 1
            //   console.log(rows); // [2, 3, 4]
            const { result, jsonData } = checkExsistance(outFiles, outFileName, outFilePath, rows);
            for (let i = 0; i < result.length; i++) {
                const row = result[i];
                // console.log(row); // [2, 3, 4]
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                jsonData.push(obj);
                // console.log(jsonData);
            }
            const outJson = JSON.stringify(jsonData, null, 2);
            //   console.log(`Parsed ${file}:`, outJson);
            //   console.log(outFile);
            fs_1.default.writeFileSync(`${outFilePath}`, outJson, "utf-8");
        });
    });
});
