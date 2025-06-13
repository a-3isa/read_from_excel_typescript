import readXlsxFile from "read-excel-file/node";
import * as fs from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileExistsValidator } from "./validators/validator";

export function toCamelCaseArray(strings: string[]): string[] {
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

export const convertExcelFunc = async function (
  inFilePath: string,
  outFilePath: string
) {
  const db = await open({
    filename: `./output_db/${outFilePath!.split("xlsx")[0]}db`, // Specify the database file
    driver: sqlite3.Database,
  });
  const tableName = outFilePath!.split(".xlsx")[0];
  readXlsxFile(inFilePath).then(async (rows) => {
    let headers = rows.shift() as string[];
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
      } else {
        console.log("File deleted successfully");
      }
    });
  });
};

export async function fetechJsonFunc(fileName: string) {
  if (fileExistsValidator(fileName)) {
    const db = await open({
      filename: `./output_db/${fileName}.db`, // Specify the database file
      driver: sqlite3.Database,
    });
    const sql = `SELECT * FROM ${fileName};`;
    const row = await db.all(sql);
    return row;
  } else {
    return false;
  }
}
