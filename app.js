"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("read-excel-file/node");
var fs_1 = require("fs");
var path_1 = require("path");
function toCamelCaseArray(strings) {
    return strings.map(function (str) {
        var words = str.trim().split(/[\s_\-]+/); // split on space, underscore, dash
        return words
            .map(function (word, index) {
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
    for (var i = 0; i < a.length; i++) {
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
var inputDir = "./input";
var outputDir = "./output";
var outFiles;
fs_1.default.readdir(outputDir, function (error, files) {
    outFiles = files;
});
fs_1.default.readdir(inputDir, function (err, files) {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }
    var xlsxFiles = files.filter(function (file) { return file.endsWith(".xlsx"); });
    xlsxFiles.forEach(function (file) {
        var inFilePath = path_1.default.join(inputDir, file);
        var outFileName = "".concat(file.split("xlsx")[0], "json");
        var outFilePath = path_1.default.join(outputDir, outFileName);
        (0, node_1.default)(inFilePath).then(function (rows) { return __awaiter(void 0, void 0, void 0, function () {
            var headers, jsonData, _loop_1, i, outJson;
            return __generator(this, function (_a) {
                headers = rows.shift();
                headers = toCamelCaseArray(headers);
                jsonData = [];
                _loop_1 = function (i) {
                    var row = rows[i];
                    // console.log(row); // [2, 3, 4]
                    var obj = {};
                    headers.forEach(function (header, index) {
                        obj[header] = row[index];
                    });
                    jsonData.push(obj);
                };
                //   console.log(headers); // 1
                //   console.log(rows); // [2, 3, 4]
                // const { result, jsonData } = checkExsistance(
                //   outFiles,
                //   outFileName,
                //   outFilePath,
                //   rows
                // );
                for (i = 0; i < rows.length; i++) {
                    _loop_1(i);
                }
                outJson = JSON.stringify(jsonData, null, 2);
                //   console.log(`Parsed ${file}:`, outJson);
                //   console.log(outFile);
                fs_1.default.writeFileSync("".concat(outFilePath), outJson, "utf-8");
                return [2 /*return*/];
            });
        }); });
    });
});
