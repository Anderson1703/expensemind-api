import express, { Request, Response, Router } from "express";
import usersRouter from "./users/users.routes";
import authRouter from "./auth/auth.routes";
import categoriesRouter from "./categories/categories.routes";
import planesRouter from "./planes/planes.routes";
import preferencesRouter from "./preferences/preferences.route";
import expensesRouter from "./expenses/expenses.routes";
import ocrRouter from "./ocr/ocr.routes";

const root = Router();
const server = express();

root.get("/", (req: Request, res: Response) => {
  res.send("ExpenseMind API");
});

server.use("/", root);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/categories", categoriesRouter);
server.use("/planes", planesRouter);
server.use("/preferences", preferencesRouter);
server.use("/expenses", expensesRouter);
server.use("/ocr", ocrRouter); 

export default server;
