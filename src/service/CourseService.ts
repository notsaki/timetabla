import Service from "./Service";
import { Course } from "../schema/database/CourseSchema";
import CourseRepository from "../repository/CourseRepository";
import RepositorySingleton from "../singleton/RepositorySingleton";
import { User } from "../schema/database/UserSchema";
import CourseData from "../schema/responsebody/CourseData";
import NewCourseBody from "../schema/requestbody/NewCourseBody";
import UserRepository from "../repository/UserRepository";

export default class CourseService implements Service {
    private courseRepository: CourseRepository = RepositorySingleton.courseRepository;
    private userRepository: UserRepository = RepositorySingleton.userRepository;

    async findOne(search: object): Promise<CourseData> {
        const course: Course = await this.courseRepository.findOne(search);
        const professors: User[] = await this.userRepository.findMany({ _id: { $in: course.professorIds } });

        const { professorIds, ...courseFiltered } = course;

        return { ...courseFiltered, professors };
    }

    async findMany(search: object): Promise<CourseData[]> {
        const courses: Course[] = await this.courseRepository.findMany(search);

        const courseData: CourseData[] = [];

        for (const course of courses) {
            const professors: User[] = await this.userRepository.findMany({ _id: { $in: course.professorIds } });

            const { professorIds, ...courseFiltered } = course;

            courseData.push({ ...courseFiltered, professors });
        }

        return courseData;
    }

    async saveOne(course: NewCourseBody): Promise<void> {
        await this.courseRepository.saveOne(course);
    }

    async saveMany(courses: NewCourseBody[]): Promise<void> {
        await this.courseRepository.saveMany(courses);
    }

    async findById(_id: string): Promise<CourseData> {
        return await this.findOne({ _id });
    }

    async findByManyIds(ids: string[]): Promise<CourseData[]> {
        return await this.findMany({ _id: { $in: ids } });
    }

    async deleteMany(search: any): Promise<void> {
        return await this.courseRepository.deleteMany(search);
    }

    async deleteOne(id: string): Promise<void> {
        return await this.courseRepository.deleteOne(id);
    }

    async updateMany(search: any, data: object): Promise<void> {
        return await this.courseRepository.updateMany(search, data);
    }

    async updateOne(id: string, data: object): Promise<void> {
        return await this.courseRepository.updateOne(id, data);
    }

    async exists(search: object): Promise<boolean> {
        return await this.courseRepository.exists(search);
    }
}
