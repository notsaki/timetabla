import { insertTestCourses, insertTestUsers } from "./InsertTestData";
import { Done } from "mocha";

export function resetUserCollectionState(done: Done) {
    insertTestUsers()
        .then(done)
        .catch(function (error: any) {
            console.log(`Error resetting users collection state: ${error}`);
        });
}

export function resetCourseCollectionState(done: Done) {
    insertTestCourses()
        .then(done)
        .catch(function (error: any) {
            console.log(`Error resetting courses collection state: ${error}`);
        });
}
