import "dotenv/config";
import express from "express";
import mongoose, { Error, ObjectId } from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import apiController from "./Api";
import UserSchema, { Role, User } from "./schema/database/UserSchema";
import insertTestData from "../test/utils/InsertTestData";
import session, { SessionOptions } from "express-session";
import UserService from "./service/UserService";
import ConnectMongoDBSession, { MongoDBStore } from "connect-mongodb-session";

const PORT = 8080;

const MongoStore: typeof MongoDBStore = ConnectMongoDBSession(session);
const store: MongoDBStore = new MongoStore({
    uri: process.env.DB_URI!,
    collection: "sessions",
});

declare module "express-session" {
    export interface SessionData {
        user: {
            id?: mongoose.Types.ObjectId;
            username?: string;
            authenticated: boolean;
        };
    }
}

let sessionSettings: SessionOptions = {
    name: "user",
    secret: process.env.SESSION_SECRET_KEY!,
    saveUninitialized: true,
    cookie: {
        domain: "127.0.0.1:8080",
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
    },
    resave: false,
    store: store,
};

const app = express();

switch (process.env.ENVIRONMENT) {
    case "prod":
        app.set("trust proxy", 1);
        sessionSettings.cookie!.secure = true;
        console.log("Running production environment.");
        break;
    case "dev":
        console.log("Running development environment.");
        break;
    case "test":
        console.log("Running testing environment.");
        break;
    default:
        console.log("Unknown environment name. Exiting...");
        process.exit(0);
}

/*
 * Middlewares
 */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionSettings));

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
                        UserService.saveNew(
                            new User().assign({
                                username: process.env.APPLICATION_ADMIN_USERNAME,
                                password: process.env.APPLICATION_ADMIN_PASSWORD!,
                                email: process.env.APPLICATION_ADMIN_EMAIL,
                                fullname: process.env.APPLICATION_ADMIN_FULLNAME,
                                role: Role.Admin,
                                activationCode: null,
                            })
                        )
                            .then(() => console.log("Admin user has been created."))
                            .catch((error) => console.log(`Could not create admin user: ${error.message}`));
                    }
                    break;
            }
        },
        (error) => console.log(`Could not connect to database: ${error.message}`)
    );

app.listen(PORT, () => console.log(`Server started in port ${PORT}.`));

export default app;
