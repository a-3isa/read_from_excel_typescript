"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers/controllers");
const multer_1 = __importDefault(require("multer"));
const path = require("path");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: "input_xlsx/",
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const mimeType = file.mimetype;
        if (ext === ".xlsx" &&
            mimeType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            cb(null, true);
        }
        else {
            cb(new Error("Only .xlsx files are allowed"));
        }
    },
});
router.post("/", upload.single("file"), controllers_1.convertExcel);
router.get("/:id", controllers_1.fetechJson);
exports.default = router;
