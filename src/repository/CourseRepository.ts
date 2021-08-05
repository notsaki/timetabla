import EntityNotFoundError from "../error/EntityNotFoundError";
import CourseSchema, { Course } from "../schema/database/CourseSchema";
import Repository from "./Repository";

export default class CourseRepository implements Repository<Course> {
    async saveOne(course: Course): Promise<void> {
        await new CourseSchema(course).save();
    }

    async saveMany(users: Course[]): Promise<void> {
        await CourseSchema.insertMany(users);
    }

    async deleteOne(name: string): Promise<void> {
        await CourseSchema.deleteOne({ name });
    }

    async deleteMany(search: object): Promise<void> {
        await CourseSchema.deleteMany(search);
    }

    async findOne(name: string): Promise<Course> {
        const course: Course | null = await CourseSchema.findOne({ name });

        if (!course) {
            throw new EntityNotFoundError("Course not found.");
        }

        return course;
    }

    async findMany(search: object): Promise<Course[]> {
        return CourseSchema.find(search);
    }

    async exists(name: string): Promise<boolean> {
        return CourseSchema.exists({ name });
    }

    async count(search: object): Promise<number> {
        return CourseSchema.count(search);
    }

    async updateOne(name: string, update: object): Promise<void> {
        await CourseSchema.updateOne({ name }, update);
    }

    async updateMany(search: object, update: object): Promise<void> {
        await CourseSchema.updateMany(search, update);
    }
}
