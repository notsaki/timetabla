import UserSchema, { User } from "../../src/schema/database/UserSchema";
import fs from "fs";
import CourseSchema, { Course } from "../../src/schema/database/CourseSchema";
import { Model } from "mongoose";
import ServiceSingleton from "../../src/singleton/ServiceSingleton";
import Service from "../../src/service/Service";

export default async function insertTestData() {
    await insertTestUsers();
    console.log("Testing users have been saved.");

    await insertTestCourses();
    console.log("Testing courses have been saved.");
}

export async function insertTestUsers() {
    await resetCollection<User>(UserSchema, "users.json", ServiceSingleton.userService);
}

export async function insertTestCourses() {
    await resetCollection<Course>(CourseSchema, "courses.json", ServiceSingleton.courseService);
}

async function resetCollection<T>(schema: Model<T>, jsonFile: string, service: Service) {
    try {
        await schema.deleteMany({});
    } catch (error: any) {}

    let data: T[] = JSON.parse(fs.readFileSync(`./test/testdata/${jsonFile}`, "utf-8"));

    await service.saveMany(data);
}
