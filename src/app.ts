import express from "express";
import router from "./routes/routes";

const app = express();
app.use("/", router);
app.listen(3000);
