import EntityNotFoundError from "../error/EntityNotFoundError";
import CourseSchema, { Course } from "../schema/database/CourseSchema";
import Repository from "./Repository";

export default class CourseRepository implements Repository<Course> {
    async saveOne(course: Course): Promise<Course> {
        return await new CourseSchema(course).save();
    }

    async saveMany(users: Course[]): Promise<Course[]> {
        return await CourseSchema.insertMany(users);
    }

    async deleteOne(_id: string): Promise<void> {
        await CourseSchema.deleteOne({ _id });
    }

    async deleteMany(search: object): Promise<void> {
        await CourseSchema.deleteMany(search);
    }

    async findOne(search: object): Promise<Course> {
        const course: Course | null = await CourseSchema.findOne(search);

        if (!course) {
            throw new EntityNotFoundError("Course not found.");
        }

        return course;
    }

    async findMany(search: object): Promise<Course[]> {
        return CourseSchema.find(search);
    }

    async exists(search: object): Promise<boolean> {
        return CourseSchema.exists(search);
    }

    async count(search: object): Promise<number> {
        return CourseSchema.count(search);
    }

    async updateOne(_id: string, update: object): Promise<void> {
        await CourseSchema.updateOne({ _id }, update);
    }

    async updateMany(search: object, update: object): Promise<void> {
        await CourseSchema.updateMany(search, update);
    }

    async findById(id: string): Promise<Course> {
        const course: Course | null = await CourseSchema.findById(id);

        if (!course) {
            throw new EntityNotFoundError("Course not found.");
        }

        return course;
    }
}
