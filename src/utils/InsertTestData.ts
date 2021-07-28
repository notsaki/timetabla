import UserSchema, { User } from "../schema/UserSchema";
import fs from "fs";
import hash from "./Hash";

async function insertTestData() {
    try {
        await UserSchema.collection.drop();
    } catch (error) {}

    let users: User[] = JSON.parse(fs.readFileSync("./src/testdata/users.json", "utf-8"));

    users.map((user: User) => {
        user.password = hash(user.password);
        return user;
    });

    UserSchema.insertMany(users)
        .then(() => console.log("Testing users have been saved."))
        .catch((error) => console.log(`Could not save test users: ${error.message}`));
}

export default insertTestData;
