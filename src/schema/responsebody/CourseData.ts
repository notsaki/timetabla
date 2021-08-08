import { Semester } from "../database/CourseSchema";
import { User } from "../database/UserSchema";

export default interface CourseData {
    _id?: string;
    name: string;
    professors: User[];
    theoryHours: number;
    labHours: number;
    coachingHours: number;
    semester: Semester;
}
