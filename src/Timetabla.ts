import "dotenv/config";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import apiController from "./Api";
import UserSchema, { RegisterUser, Role, User } from "./schema/UserSchema";
import UserService from "./service/UserService";
import hash from "./utils/Hash";

const app: Express = express();

/*
 * Middlewares
 */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * Controllers
 */
app.use("/api", apiController);

/*
 * Database connection
 */
mongoose
    .connect(process.env.DB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        async () => {
            if (process.env.ENVIRONMENT === "test") {
                await UserSchema.collection.drop();
            }

            if (!(await UserSchema.exists({ username: "admin" }))) {
                await new UserSchema({
                    username: process.env.APPLICATION_ADMIN_USERNAME,
                    password: hash(process.env.APPLICATION_ADMIN_PASSWORD!),
                    email: process.env.APPLICATION_ADMIN_EMAIL,
                    fullname: process.env.APPLICATION_ADMIN_FULLNAME,
                    role: Role.Admin,
                    activationCode: null,
                }).save();
            }

            console.log("Connection to database established.");
        },
        error => console.log(`Could not connect to database: ${error.message}`)
    );

app.listen(8080, () => console.log("Server started in port 8080."));
