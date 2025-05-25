"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetechJson = exports.convertExcel = void 0;
const convert_xlsx_1 = require("../convert_xlsx");
const convertExcel = (req, res, next) => {
    var _a, _b;
    try {
        const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const fileName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname;
        console.log(fileName);
        if (!filePath) {
            res.status(400).json({ error: "No file uploaded" });
        }
        (0, convert_xlsx_1.convertExcelFunc)(filePath, fileName);
        res.status(200).json({ success: "Successfully converted the file" });
    }
    catch (error) {
        console.error("Error reading XLSX file:", error);
        res.status(500).json({ error: "Failed to read Excel file" });
    }
};
exports.convertExcel = convertExcel;
const fetechJson = (req, res, next) => {
    const jsonData = (0, convert_xlsx_1.fetechJsonFunc)(req.params.id);
    res.status(200).json({
        data: jsonData,
    });
    next();
};
exports.fetechJson = fetechJson;
