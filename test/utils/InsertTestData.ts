import UserSchema, { User } from "../../src/schema/UserSchema";
import fs from "fs";
import UserService from "../../src/service/UserService";

async function insertTestData() {
    insertTestUsers()
        .then(() => console.log("Testing users have been saved."))
        .catch((error) => console.log(`Could not save test users: ${error.message}`));
}

export async function insertTestUsers() {
    try {
        await UserSchema.collection.drop();
    } catch (error) {}

    let users: User[] = JSON.parse(fs.readFileSync("./test/testdata/users.json", "utf-8"));

    await UserService.saveMany(users);
}

export default insertTestData;
