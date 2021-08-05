import UserSchema, { User } from "../../src/schema/database/UserSchema";
import fs from "fs";
import CourseSchema, { Course } from "../../src/schema/database/CourseSchema";
import { Model } from "mongoose";
import Repository from "../../src/repository/Repository";
import SingletonRepository from "../../src/SingletonRepository";

export default async function insertTestData() {
    await insertTestUsers();
    console.log("Testing users have been saved.");

    await insertTestCourses();
    console.log("Testing courses have been saved.");
}

export async function insertTestUsers() {
    await resetCollection<User>(UserSchema, "users.json", SingletonRepository.userRepository);
}

export async function insertTestCourses() {
    await resetCollection<Course>(CourseSchema, "courses.json", SingletonRepository.courseRepository);
}

async function resetCollection<T>(schema: Model<T>, jsonFile: string, repository: Repository<T>) {
    try {
        await schema.collection.drop();
    } catch (error: any) {}

    let data: T[] = JSON.parse(fs.readFileSync(`./test/testdata/${jsonFile}`, "utf-8"));

    await repository.saveMany(data);
}
