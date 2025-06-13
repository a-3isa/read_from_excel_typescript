import { RequestHandler } from "express";
import { convertExcelFunc, fetechJsonFunc } from "../convert_xlsx";

export const convertExcel: RequestHandler = (req, res, next) => {
  try {
    const filePath = req.file?.path;
    const fileName = req.file?.originalname;
    console.log(fileName);

    if (!filePath) {
      res.status(400).json({ error: "No file uploaded" });
    }
    convertExcelFunc(filePath!, fileName!);
    res.status(200).json({ success: "Successfully converted the file" });
  } catch (error) {
    console.error("Error reading XLSX file:", error);
    res.status(500).json({ error: "Failed to read Excel file" });
  }
};

export const fetechJson: RequestHandler = async (req, res, next) => {
  const jsonData = await fetechJsonFunc(req.params.id);
  if (!jsonData) {
    throw new Error(`File does not exist: ${req.params.id}`);
  }
  res.status(200).json({
    data: jsonData,
  });
  next();
};
