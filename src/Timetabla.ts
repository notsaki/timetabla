import "dotenv/config";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
    res.send("Timetabla");
});

mongoose
    .connect(process.env.DB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        () => console.log("Connection to database established."),
        error => console.log(`Could not connect to database: ${error.message}`)
    );

app.listen(8080, () => console.log("Server started in port 8080."));
