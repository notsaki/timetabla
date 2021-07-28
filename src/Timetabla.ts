import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import apiController from "./Api";
import UserSchema, { Role, User } from "./schema/UserSchema";
import hash from "./utils/Hash";
import insertTestData from "./utils/InsertTestData";

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
            console.log("Connection to database established.");

            switch (process.env.ENVIRONMENT) {
                case "dev":
                    insertTestData().then(() => console.log("Testing data added successfully!"));
                    break;
                case "prod":
                    if (!(await UserSchema.exists({ username: "admin" }))) {
                        new UserSchema({
                            username: process.env.APPLICATION_ADMIN_USERNAME,
                            password: hash(process.env.APPLICATION_ADMIN_PASSWORD!),
                            email: process.env.APPLICATION_ADMIN_EMAIL,
                            fullname: process.env.APPLICATION_ADMIN_FULLNAME,
                            role: Role.Admin,
                            activationCode: null,
                        })
                            .save()
                            .then(() => console.log("Admin user has been created."))
                            .catch((error) => console.log(`Could not create admin user: ${error.message}`));
                    }
                    break;
            }
        },
        (error) => console.log(`Could not connect to database: ${error.message}`)
    );

app.listen(8080, () => console.log("Server started in port 8080."));

export default app;
