import { insertTestUsers } from "./InsertTestData";
import { Done } from "mocha";

export function resetUserCollectionState(done: Done) {
    insertTestUsers()
        .then(done)
        .catch((error) => {
            console.log(`Error resetting the database state: ${error}`);
        });
}
