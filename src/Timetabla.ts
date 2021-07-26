import express, { Request, Response } from "express";

const app = express();

app.get("/", async (req: Request, res: Response) => {
    res.send("Timetabla");
});

app.listen(8080, () => console.log("Server started at port 8080."));
