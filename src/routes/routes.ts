import { Router } from "express";
import { convertExcel, fetechJson } from "../controllers/controllers";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "input_xlsx/" });

router.post("/", upload.single("file"), convertExcel);
router.get("/:id", fetechJson);

export default router;
