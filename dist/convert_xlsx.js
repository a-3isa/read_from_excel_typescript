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
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const validator_1 = require("./validators/validator");
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
const convertExcelFunc = async function (inFilePath, outFilePath) {
    const db = await (0, sqlite_1.open)({
        filename: `./output_db/${outFilePath.split("xlsx")[0]}db`, // Specify the database file
        driver: sqlite3_1.default.Database,
    });
    const tableName = outFilePath.split(".xlsx")[0];
    (0, node_1.default)(inFilePath).then(async (rows) => {
        let headers = rows.shift();
        headers = toCamelCaseArray(headers);
        const columns = headers.map((header) => `\'${header}\'`).join(", "); // Wrap each header in backticks
        let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`;
        await db.run(sql);
        let rowData;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            rowData = row.map((row) => `\'${row}\'`).join(", "); // Wrap each header in backticks
            sql = `INSERT INTO ${tableName} VALUES (${rowData})`;
            await db.run(sql);
        }
        fs.unlink(inFilePath, (err) => {
            if (err) {
                console.error("Failed to delete file:", err);
            }
            else {
                console.log("File deleted successfully");
            }
        });
    });
};
exports.convertExcelFunc = convertExcelFunc;
async function fetechJsonFunc(fileName) {
    if ((0, validator_1.fileExistsValidator)(fileName)) {
        const db = await (0, sqlite_1.open)({
            filename: `./output_db/${fileName}.db`, // Specify the database file
            driver: sqlite3_1.default.Database,
        });
        const sql = `SELECT * FROM ${fileName};`;
        const row = await db.all(sql);
        return row;
    }
    else {
        return false;
    }
}
