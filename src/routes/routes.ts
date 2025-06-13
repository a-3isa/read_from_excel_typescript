import { Router } from "express";
import { convertExcel, fetechJson } from "../controllers/controllers";
import multer from "multer";
const path = require("path");

const router = Router();
const upload = multer({
  dest: "input_xlsx/",
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const mimeType = file.mimetype;

    if (
      ext === ".xlsx" &&
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx files are allowed"));
    }
  },
});

router.post("/", upload.single("file"), convertExcel);
router.get("/:id", fetechJson);

export default router;
